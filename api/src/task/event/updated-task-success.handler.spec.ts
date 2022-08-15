import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UpdatedTaskSuccessEvent } from './updated-task-success.event';
import { UpdatedTaskSuccessHandler } from './updated-task-success.handler';

describe(UpdatedTaskSuccessHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(UpdatedTaskSuccessHandler.prototype, 'handle');
    jest.spyOn(console, 'info').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [UpdatedTaskSuccessHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([UpdatedTaskSuccessHandler]);

    target = eventBus;
  });

  describe(`${UpdatedTaskSuccessHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.info as jest.Mock).mockClear();
      (
        UpdatedTaskSuccessHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Success Event and run UpdatedTaskSuccessHandler.handle success', async () => {
      const useCase = new UpdatedTaskSuccessEvent(
        {} as any,
        {
          id: 'test',
        } as any,
      );
      const result = target.publish<UpdatedTaskSuccessEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Updated task test', {
        id: 'test',
      });
      expect(UpdatedTaskSuccessHandler.prototype.handle).toHaveBeenCalledTimes(
        1,
      );
      expect(UpdatedTaskSuccessHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
