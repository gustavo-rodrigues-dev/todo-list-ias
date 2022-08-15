import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { GetTaskHandler } from './get-task.handler';
import { GetTaskService } from '../services/get-task';
import { GotTaskFailureHandler } from '../event/got-task-failure.handler';
import { GotTaskSuccessHandler } from '../event/got-task-success.handler';
import { GetTaskQuery } from './get-task.query';

describe(GetTaskHandler.name, () => {
  let target: GetTaskHandler;
  let getTask: Function;
  let failureEventHandle: GotTaskFailureHandler;
  let successEventHandle: GotTaskSuccessHandler;
  beforeAll(async () => {
    getTask = jest.fn().mockImplementation(async args => {
      if (args === 'error') {
        throw new Error('Some Error');
      }
      const result = {
        id: 'testid',
        title: 'test',
        description: 'test',
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
        GetTaskService,
        GetTaskHandler,
        GotTaskFailureHandler,
        GotTaskSuccessHandler,
      ],
    })
      .overrideProvider(GetTaskService)
      .useValue({
        get: getTask,
      })
      .overrideProvider(GotTaskFailureHandler)
      .useValue(failureEventHandle)
      .overrideProvider(GotTaskSuccessHandler)
      .useValue(successEventHandle)
      .compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([GotTaskFailureHandler, GotTaskSuccessHandler]);
    target = moduleRef.get<GetTaskHandler>(GetTaskHandler);
  });
  beforeEach(() => {
    (getTask as jest.Mock).mockClear();
    (successEventHandle.handle as jest.Mock).mockClear();
    (failureEventHandle.handle as jest.Mock).mockClear();
  });

  describe(`${GetTaskHandler.name}.execute()`, () => {
    it('Should return task on execute handle', async () => {
      const query = new GetTaskQuery('testid');

      const result = {
        id: 'testid',
        title: 'test',
        description: 'test',
      };

      const useCase = await target.execute(query);

      expect(getTask).toHaveBeenCalledWith(query.taskId);
      expect(getTask).toHaveBeenCalledTimes(1);
      expect(failureEventHandle.handle).toHaveBeenCalledTimes(0);
      expect(successEventHandle.handle).toHaveBeenCalledTimes(1);
      expect(successEventHandle.handle).toHaveBeenCalledWith({
        query,
        result,
      });
      expect(useCase).toEqual(result);
    });

    it('Should return error on execute handle', async () => {
      const query = new GetTaskQuery('error');

      let error!: Error;
      let useCase;

      try {
        useCase = await target.execute(query);
      } catch (err) {
        error = err as Error;
      }

      expect(getTask).toHaveBeenCalledWith(query.taskId);
      expect(getTask).toHaveBeenCalledTimes(1);
      expect(successEventHandle.handle).toHaveBeenCalledTimes(0);
      expect(failureEventHandle.handle).toHaveBeenCalledTimes(1);
      expect(failureEventHandle.handle).toHaveBeenCalledWith({
        query,
        error,
      });

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
