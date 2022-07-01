import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { CreatedTaskSuccessEvent } from './created-task-success.event';
import { CreatedTaskSuccessHandler } from './created-task-success.handler';

describe(CreatedTaskSuccessHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(CreatedTaskSuccessHandler.prototype, 'handle');
    jest.spyOn(console, 'info').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [CreatedTaskSuccessHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([CreatedTaskSuccessHandler]);

    target = eventBus;
  });

  describe(`${CreatedTaskSuccessHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.info as jest.Mock).mockClear();
      (
        CreatedTaskSuccessHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Success Event and run CreatedTaskSuccessHandler.handle success', async () => {
      const useCase = new CreatedTaskSuccessEvent(
        {} as any,
        {
          id: 'test',
        } as any,
      );
      const result = target.publish<CreatedTaskSuccessEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith(
        `Created task ${useCase.result.id}`,
      );
      expect(CreatedTaskSuccessHandler.prototype.handle).toHaveBeenCalledTimes(
        1,
      );
      expect(CreatedTaskSuccessHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
