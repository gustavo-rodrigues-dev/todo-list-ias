import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { UpdateTaskHandler } from './update-task.handler';
import { UpdateTaskService } from '../services/update-task';
import { UpdatedTaskFailureHandler } from '../event/updated-task-failure.handler';
import { UpdatedTaskSuccessHandler } from '../event/updated-task-success.handler';

describe(UpdateTaskHandler.name, () => {
  let target: UpdateTaskHandler;
  let update: Function;
  let failureEventHandle: UpdatedTaskFailureHandler;
  let successEventHandle: UpdatedTaskSuccessHandler;
  beforeAll(async () => {
    update = jest.fn().mockImplementation(async args => {
      if (!!args.error) {
        throw new Error('Some Error');
      }
      const result = {
        id: 'testid',
        ...args,
      };
      return result;
    });

    failureEventHandle = {
      handle: jest.fn().mockImplementation(() => {}),
    };

    successEventHandle = {
      handle: jest.fn().mockImplementation(() => {}),
    };

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});

    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        UpdateTaskService,
        UpdateTaskHandler,
        UpdatedTaskFailureHandler,
        UpdatedTaskSuccessHandler,
      ],
    })
      .overrideProvider(UpdateTaskService)
      .useValue({
        update,
      })
      .overrideProvider(UpdatedTaskFailureHandler)
      .useValue(failureEventHandle)
      .overrideProvider(UpdatedTaskSuccessHandler)
      .useValue(successEventHandle)
      .compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([UpdatedTaskFailureHandler, UpdatedTaskSuccessHandler]);
    target = moduleRef.get<UpdateTaskHandler>(UpdateTaskHandler);
  });
  beforeEach(() => {
    (update as jest.Mock).mockClear();
    (successEventHandle.handle as jest.Mock).mockClear();
    (failureEventHandle.handle as jest.Mock).mockClear();
  });

  describe(`${UpdateTaskHandler.name}.execute()`, () => {
    it('Should return task Updated on execute handle', async () => {
      const command = {
        id: 'testid',
        name: 'UpdateTask',
        task: {
          title: 'Hello',
          description: 'Hello world!',
        },
      };

      const result = {
        id: 'testid',
        ...command.task,
      };

      const useCase = await target.execute(command);

      expect(update).toHaveBeenCalledWith(command.task);
      expect(update).toHaveBeenCalledTimes(1);
      expect(failureEventHandle.handle).toHaveBeenCalledTimes(0);
      expect(successEventHandle.handle).toHaveBeenCalledTimes(1);
      expect(successEventHandle.handle).toHaveBeenCalledWith({
        command,
        result,
      });
      expect(useCase).toEqual(result);
    });

    it('Should return error on execute handle', async () => {
      const command = {
        name: 'UpdateTask',
        task: {
          title: 'Hello',
          description: 'Hello world!',
          error: true,
        },
      };

      let error!: Error;
      let useCase;

      try {
        useCase = await target.execute(command);
      } catch (err) {
        error = err as Error;
      }

      expect(update).toHaveBeenCalledWith(command.task);
      expect(update).toHaveBeenCalledTimes(1);
      expect(successEventHandle.handle).toHaveBeenCalledTimes(0);
      expect(failureEventHandle.handle).toHaveBeenCalledTimes(1);
      expect(failureEventHandle.handle).toHaveBeenCalledWith({
        command,
        error,
      });

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
