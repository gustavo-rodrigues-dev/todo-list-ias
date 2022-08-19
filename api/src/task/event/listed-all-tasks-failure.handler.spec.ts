import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ListedAllTasksFailureEvent } from './listed-all-tasks-failure.event';
import { ListedAllTasksFailureHandler } from './listed-all-tasks-failure.handler';

describe(ListedAllTasksFailureHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(ListedAllTasksFailureHandler.prototype, 'handle');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [ListedAllTasksFailureHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([ListedAllTasksFailureHandler]);

    target = eventBus;
  });

  describe(`${ListedAllTasksFailureHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.error as jest.Mock).mockClear();
      (
        ListedAllTasksFailureHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Failure Event and run ListedAllTasksFailureHandler.handle success', async () => {
      const useCase = new ListedAllTasksFailureEvent(
        {} as any,
        new Error('Some Error'),
      );
      const result = target.publish<ListedAllTasksFailureEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Error on get all tasks: ${useCase.error.toString()}`,
      );
      expect(
        ListedAllTasksFailureHandler.prototype.handle,
      ).toHaveBeenCalledTimes(1);
      expect(
        ListedAllTasksFailureHandler.prototype.handle,
      ).toHaveBeenCalledWith(useCase);
    });
  });
});
