import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { CreatedTaskFailureEvent } from './created-task-failure.event';
import { CreatedTaskFailureHandler } from './created-task-failure.handler';

describe(CreatedTaskFailureHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(CreatedTaskFailureHandler.prototype, 'handle');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [CreatedTaskFailureHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([CreatedTaskFailureHandler]);

    target = eventBus;
  });

  describe(`${CreatedTaskFailureHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.error as jest.Mock).mockClear();
      (
        CreatedTaskFailureHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Failure Event and run CreatedTaskFailureHandler.handle success', async () => {
      const useCase = new CreatedTaskFailureEvent(
        {
          task: {
            title: 'test',
          },
        } as any,
        new Error('Some Error'),
      );
      const result = target.publish<CreatedTaskFailureEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Error on process task ${
          useCase.command.task.title
        }, ${useCase.error.toString()}`,
      );
      expect(CreatedTaskFailureHandler.prototype.handle).toHaveBeenCalledTimes(
        1,
      );
      expect(CreatedTaskFailureHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
