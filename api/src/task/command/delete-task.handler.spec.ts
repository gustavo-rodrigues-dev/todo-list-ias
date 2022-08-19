import { Test } from '@nestjs/testing';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { DeleteTaskHandler } from './delete-task.handler';
import { DeleteTaskService } from '../services/delete-task';
import { DeletedTaskFailureHandler } from '../event/deleted-task-failure.handler';
import { DeletedTaskSuccessHandler } from '../event/deleted-task-success.handler';
import { DeleteTaskCommand } from './delete-task.command';

describe(DeleteTaskHandler.name, () => {
  let target: DeleteTaskHandler;
  let deleteAction: Function;
  let failureEventHandle: DeletedTaskFailureHandler;
  let successEventHandle: DeletedTaskSuccessHandler;
  beforeAll(async () => {
    deleteAction = jest.fn().mockImplementation(async args => {
      if (args === 'error') {
        throw new Error('Some Error');
      }
      return;
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
        DeleteTaskService,
        DeleteTaskHandler,
        DeletedTaskFailureHandler,
        DeletedTaskSuccessHandler,
      ],
    })
      .overrideProvider(DeleteTaskService)
      .useValue({
        delete: deleteAction,
      })
      .overrideProvider(DeletedTaskFailureHandler)
      .useValue(failureEventHandle)
      .overrideProvider(DeletedTaskSuccessHandler)
      .useValue(successEventHandle)
      .compile();

    const eventBus = moduleRef.get<EventBus>(EventBus);
    eventBus.register([DeletedTaskFailureHandler, DeletedTaskSuccessHandler]);
    target = moduleRef.get<DeleteTaskHandler>(DeleteTaskHandler);
  });
  beforeEach(() => {
    (deleteAction as jest.Mock).mockClear();
    (successEventHandle.handle as jest.Mock).mockClear();
    (failureEventHandle.handle as jest.Mock).mockClear();
  });

  describe(`${DeleteTaskHandler.name}.execute()`, () => {
    it('Should return task Deleted on execute handle', async () => {
      const command = new DeleteTaskCommand('testid');

      const result = undefined;

      const useCase = await target.execute(command);

      expect(deleteAction).toHaveBeenCalledWith(command.taskId);
      expect(deleteAction).toHaveBeenCalledTimes(1);
      expect(failureEventHandle.handle).toHaveBeenCalledTimes(0);
      expect(successEventHandle.handle).toHaveBeenCalledTimes(1);
      expect(successEventHandle.handle).toHaveBeenCalledWith({
        command,
        result,
      });
      expect(useCase).toEqual(result);
    });

    it('Should return error on execute handle', async () => {
      const command = new DeleteTaskCommand('error');

      let error!: Error;
      let useCase;

      try {
        useCase = await target.execute(command);
      } catch (err) {
        error = err as Error;
      }

      expect(deleteAction).toHaveBeenCalledWith(command.taskId);
      expect(deleteAction).toHaveBeenCalledTimes(1);
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
