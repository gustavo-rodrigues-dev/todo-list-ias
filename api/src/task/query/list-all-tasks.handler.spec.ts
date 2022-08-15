import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ListAllTasksHandler } from './list-all-tasks.handler';
import { ListAllTasksService } from '../services/list-all-tasks';
import { ListedAllTasksFailureHandler } from '../event/listed-all-tasks-failure.handler';
import { ListedAllTasksSuccessHandler } from '../event/listed-all-tasks-success.handler';
import { ListAllTasksQuery } from './list-all-tasks.query';

describe(ListAllTasksHandler.name, () => {
  let target: ListAllTasksHandler;
  let getTask: Function;
  let failureEventHandle: ListedAllTasksFailureHandler;
  let successEventHandle: ListedAllTasksSuccessHandler;
  beforeAll(async () => {
    getTask = jest.fn().mockImplementation(async args => {
      const result = [
        {
          id: 'testid',
          title: 'test',
          description: 'test',
        },
      ];
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
        ListAllTasksService,
        ListAllTasksHandler,
        ListedAllTasksFailureHandler,
        ListedAllTasksSuccessHandler,
      ],
    })
      .overrideProvider(ListAllTasksService)
      .useValue({
        get: getTask,
      })
      .overrideProvider(ListedAllTasksFailureHandler)
      .useValue(failureEventHandle)
      .overrideProvider(ListedAllTasksSuccessHandler)
      .useValue(successEventHandle)
      .compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([
      ListedAllTasksFailureHandler,
      ListedAllTasksSuccessHandler,
    ]);
    target = moduleRef.get<ListAllTasksHandler>(ListAllTasksHandler);
  });
  beforeEach(() => {
    (getTask as jest.Mock).mockClear();
    (successEventHandle.handle as jest.Mock).mockClear();
    (failureEventHandle.handle as jest.Mock).mockClear();
  });

  describe(`${ListAllTasksHandler.name}.execute()`, () => {
    it('Should return tasks on execute handle', async () => {
      const query = new ListAllTasksQuery();

      const result = [
        {
          id: 'testid',
          title: 'test',
          description: 'test',
        },
      ];

      const useCase = await target.execute(query);

      expect(getTask).toHaveBeenCalledWith();
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
      getTask = jest.fn().mockImplementation(async _args => {
        throw new Error('Some Error');
      });

      failureEventHandle = {
        handle: jest.fn().mockImplementation(() => {}),
      };

      successEventHandle = {
        handle: jest.fn().mockImplementation(() => {}),
      };

      const moduleRef = await Test.createTestingModule({
        imports: [CqrsModule],
        providers: [
          ListAllTasksService,
          ListAllTasksHandler,
          ListedAllTasksFailureHandler,
          ListedAllTasksSuccessHandler,
        ],
      })
        .overrideProvider(ListAllTasksService)
        .useValue({
          get: getTask,
        })
        .overrideProvider(ListedAllTasksFailureHandler)
        .useValue(failureEventHandle)
        .overrideProvider(ListedAllTasksSuccessHandler)
        .useValue(successEventHandle)
        .compile();

      const eventBus = moduleRef.get<EventBus>(EventBus);
      eventBus.register([
        ListedAllTasksFailureHandler,
        ListedAllTasksSuccessHandler,
      ]);
      target = moduleRef.get<ListAllTasksHandler>(ListAllTasksHandler);
      const query = new ListAllTasksQuery();

      let error!: Error;
      let useCase;

      try {
        useCase = await target.execute(query);
      } catch (err) {
        error = err as Error;
      }

      expect(getTask).toHaveBeenCalledWith();
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
