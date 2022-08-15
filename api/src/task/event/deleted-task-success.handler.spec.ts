import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { DeletedTaskSuccessEvent } from './deleted-task-success.event';
import { DeletedTaskSuccessHandler } from './deleted-task-success.handler';

describe(DeletedTaskSuccessHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(DeletedTaskSuccessHandler.prototype, 'handle');
    jest.spyOn(console, 'info').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [DeletedTaskSuccessHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([DeletedTaskSuccessHandler]);

    target = eventBus;
  });

  describe(`${DeletedTaskSuccessHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.info as jest.Mock).mockClear();
      (
        DeletedTaskSuccessHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Success Event and run DeletedTaskSuccessHandler.handle success', async () => {
      const useCase = new DeletedTaskSuccessEvent(
        { taskId: 'taskId' },
        undefined,
      );
      const result = target.publish<DeletedTaskSuccessEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith(
        `Deleted task ${useCase.command.taskId}`,
        useCase.result,
      );
      expect(DeletedTaskSuccessHandler.prototype.handle).toHaveBeenCalledTimes(
        1,
      );
      expect(DeletedTaskSuccessHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
