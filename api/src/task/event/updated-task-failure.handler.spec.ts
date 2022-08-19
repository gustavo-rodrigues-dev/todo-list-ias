import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { UpdatedTaskFailureEvent } from './updated-task-failure.event';
import { UpdatedTaskFailureHandler } from './updated-task-failure.handler';

describe(UpdatedTaskFailureHandler.name, () => {
  let target: EventBus;
  beforeAll(async () => {
    jest.spyOn(UpdatedTaskFailureHandler.prototype, 'handle');
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [UpdatedTaskFailureHandler],
    }).compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([UpdatedTaskFailureHandler]);

    target = eventBus;
  });

  describe(`${UpdatedTaskFailureHandler.name}.handle`, () => {
    beforeEach(() => {
      (console.error as jest.Mock).mockClear();
      (
        UpdatedTaskFailureHandler.prototype
          .handle as unknown as jest.SpyInstance
      ).mockClear();
    });
    it('should emit Failure Event and run UpdatedTaskFailureHandler.handle success', async () => {
      const useCase = new UpdatedTaskFailureEvent(
        {
          task: {
            title: 'test',
            id: 'foo',
          },
        } as any,
        new Error('Some Error'),
      );
      const result = target.publish<UpdatedTaskFailureEvent>(useCase);

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Error on update task ${
          useCase.command.task.id
        }: ${useCase.error.toString()}`,
      );
      expect(UpdatedTaskFailureHandler.prototype.handle).toHaveBeenCalledTimes(
        1,
      );
      expect(UpdatedTaskFailureHandler.prototype.handle).toHaveBeenCalledWith(
        useCase,
      );
    });
  });
});
