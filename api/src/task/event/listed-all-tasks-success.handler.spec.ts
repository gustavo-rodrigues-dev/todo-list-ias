import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { ListedAllTasksSuccessEvent } from './listed-all-tasks-success.event';
import { ListedAllTasksSuccessHandler } from './listed-all-tasks-success.handler';

describe(ListedAllTasksSuccessHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(ListedAllTasksSuccessHandler.prototype, 'handle');
    jest.spyOn(console, 'info').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [ListedAllTasksSuccessHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([ListedAllTasksSuccessHandler]);

    target = eventBus;
  });

  describe(`${ListedAllTasksSuccessHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.info as jest.Mock).mockClear();
      (
        ListedAllTasksSuccessHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Success Event and run ListedAllTasksSuccessHandler.handle success', async () => {
      const useCase = new ListedAllTasksSuccessEvent({}, [
        { id: 'id', title: 'name' },
      ] as any);
      const result = target.publish<ListedAllTasksSuccessEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith(
        'Get all tasks',
        useCase.result,
      );
      expect(
        ListedAllTasksSuccessHandler.prototype.handle,
      ).toHaveBeenCalledTimes(1);
      expect(
        ListedAllTasksSuccessHandler.prototype.handle,
      ).toHaveBeenCalledWith(useCase);
    });
  });
});
