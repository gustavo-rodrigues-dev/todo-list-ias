import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { DeletedTaskFailureEvent } from './deleted-task-failure.event';
import { DeletedTaskFailureHandler } from './deleted-task-failure.handler';

describe(DeletedTaskFailureHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(DeletedTaskFailureHandler.prototype, 'handle');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [DeletedTaskFailureHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([DeletedTaskFailureHandler]);

    target = eventBus;
  });

  describe(`${DeletedTaskFailureHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.error as jest.Mock).mockClear();
      (
        DeletedTaskFailureHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Failure Event and run DeletedTaskFailureHandler.handle success', async () => {
      const useCase = new DeletedTaskFailureEvent(
        {
          taskId: 'foo',
        } as any,
        new Error('Some Error'),
      );
      const result = target.publish<DeletedTaskFailureEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Error on delete task ${
          useCase.command.taskId
        }: ${useCase.error.toString()}`,
      );
      expect(DeletedTaskFailureHandler.prototype.handle).toHaveBeenCalledTimes(
        1,
      );
      expect(DeletedTaskFailureHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
