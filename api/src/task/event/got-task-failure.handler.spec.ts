import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { GotTaskFailureEvent } from './got-task-failure.event';
import { GotTaskFailureHandler } from './got-task-failure.handler';

describe(GotTaskFailureHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(GotTaskFailureHandler.prototype, 'handle');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [GotTaskFailureHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([GotTaskFailureHandler]);

    target = eventBus;
  });

  describe(`${GotTaskFailureHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.error as jest.Mock).mockClear();
      (
        GotTaskFailureHandler.prototype.handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Failure Event and run GotTaskFailureHandler.handle success', async () => {
      const useCase = new GotTaskFailureEvent(
        {
          taskId: 'foo',
        } as any,
        new Error('Some Error'),
      );
      const result = target.publish<GotTaskFailureEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Error on get task ${
          useCase.query.taskId
        }: ${useCase.error.toString()}`,
      );
      expect(GotTaskFailureHandler.prototype.handle).toHaveBeenCalledTimes(1);
      expect(GotTaskFailureHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
