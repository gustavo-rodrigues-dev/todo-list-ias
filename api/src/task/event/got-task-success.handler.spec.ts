import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { GotTaskSuccessEvent } from './got-task-success.event';
import { GotTaskSuccessHandler } from './got-task-success.handler';

describe(GotTaskSuccessHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(GotTaskSuccessHandler.prototype, 'handle');
    jest.spyOn(console, 'info').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [GotTaskSuccessHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([GotTaskSuccessHandler]);

    target = eventBus;
  });

  describe(`${GotTaskSuccessHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.info as jest.Mock).mockClear();
      (
        GotTaskSuccessHandler.prototype.handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Success Event and run GotTaskSuccessHandler.handle success', async () => {
      const useCase = new GotTaskSuccessEvent({ taskId: 'taskId' }, {
        id: 'id',
        title: 'name',
      } as any);
      const result = target.publish<GotTaskSuccessEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith(
        `Get task ${useCase.query.taskId}`,
        useCase.result,
      );
      expect(GotTaskSuccessHandler.prototype.handle).toHaveBeenCalledTimes(1);
      expect(GotTaskSuccessHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
