import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { CreateTaskHandler } from './create-task.handler';
import { CreateTaskService } from '../services/create-task';
import { CreatedTaskFailureHandler } from '../event/created-task-failure.handler';
import { CreatedTaskSuccessHandler } from '../event/created-task-success.handler';

describe(CreateTaskHandler.name, () => {
  let target: CreateTaskHandler;
  let create: Function;
  let failureEventHandle: CreatedTaskFailureHandler;
  let successEventHandle: CreatedTaskSuccessHandler;
  beforeAll(async () => {
    create = jest.fn().mockImplementation(async args => {
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
        CreateTaskService,
        CreateTaskHandler,
        CreatedTaskFailureHandler,
        CreatedTaskSuccessHandler,
      ],
    })
      .overrideProvider(CreateTaskService)
      .useValue({
        create,
      })
      .overrideProvider(CreatedTaskFailureHandler)
      .useValue(failureEventHandle)
      .overrideProvider(CreatedTaskSuccessHandler)
      .useValue(successEventHandle)
      .compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([CreatedTaskFailureHandler, CreatedTaskSuccessHandler]);
    target = moduleRef.get<CreateTaskHandler>(CreateTaskHandler);
  });
  beforeEach(() => {
    (create as jest.Mock).mockClear();
    (successEventHandle.handle as jest.Mock).mockClear();
    (failureEventHandle.handle as jest.Mock).mockClear();
  });

  describe(`${CreateTaskHandler.name}.execute()`, () => {
    it('Should return task created on execute handle', async () => {
      const command = {
        name: 'CreateTask',
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

      expect(create).toHaveBeenCalledWith(command.task);
      expect(create).toHaveBeenCalledTimes(1);
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
        name: 'CreateTask',
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

      expect(create).toHaveBeenCalledWith(command.task);
      expect(create).toHaveBeenCalledTimes(1);
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
