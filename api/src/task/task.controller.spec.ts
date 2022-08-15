import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { CreateTaskCommand } from './command/create-task.command';
import { DeleteTaskCommand } from './command/delete-task.command';
import { UpdateTaskCommand } from './command/update-task.command';
import { GetTaskQuery } from './query/get-task.query';
import { ListAllTasksQuery } from './query/list-all-tasks.query';
import { TaskController } from './task.controller';

describe(TaskController.name, () => {
  let controller: TaskController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    commandBus = {
      execute: jest.fn().mockImplementation(async args => {
        if (args.taskId === 'error') {
          throw new Error('Some Error');
        }

        if ((args as any)?.task?.title === 'error') {
          throw new Error('Some Error');
        }

        if ((args as any)?.task?.id === 'error') {
          throw new Error('Some Error');
        }

        if (args.taskId === 'delete') {
          return undefined;
        }

        const result = {
          id: 'testid',
          ...args?.task,
        };
        return result;
      }),
    } as any;

    queryBus = {
      execute: jest.fn().mockImplementation(async args => {
        if (args?.taskId === 'error') {
          throw new Error('Some Error');
        }

        if (!args.taskId) {
          return [
            {
              id: 'testid',
              title: 'test',
              description: 'test',
            },
          ];
        }

        const result = {
          id: 'testid',
          title: 'title',
          description: 'description',
        };
        return result;
      }),
    } as any;

    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [TaskController],
    })
      .overrideProvider(CommandBus)
      .useValue(commandBus)
      .overrideProvider(QueryBus)
      .useValue(queryBus)
      .compile();

    controller = moduleRef.get<TaskController>(TaskController);
  });

  beforeEach(() => {
    (commandBus.execute as jest.Mock).mockClear();
    (queryBus.execute as jest.Mock).mockClear();
  });

  describe(`${TaskController.name}.createTask()`, () => {
    it('should call createTask success', async () => {
      const task = {
        title: 'test',
        description: 'test',
      };

      const result = await controller.createTask(task);

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateTaskCommand(task),
      );
      expect(result).toEqual({
        id: 'testid',
        title: 'test',
        description: 'test',
      });
    });

    it('should call createTask failure', async () => {
      const task = {
        title: 'error',
        description: 'test',
      };

      let result;
      let error;

      try {
        result = await controller.createTask(task);
      } catch (err) {
        error = err;
      }

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateTaskCommand(task),
      );
      expect(result).toBeUndefined();
      expect((error as any).message).toEqual('Some Error');
    });
  });

  describe(`${TaskController.name}.updateTask()`, () => {
    it('should call updateTask success', async () => {
      const taskId = 'testid';
      const task = {
        id: taskId,
        title: 'test',
        description: 'test',
      };

      const result = await controller.updateTask(taskId, task);

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateTaskCommand(task),
      );
      expect(result).toEqual({
        id: 'testid',
        title: 'test',
        description: 'test',
      });
    });

    it('should call updateTask failure', async () => {
      const taskId = 'error';
      const task = {
        id: taskId,
        title: 'error',
        description: 'test',
      };

      let result;
      let error;

      try {
        result = await controller.updateTask(taskId, task);
      } catch (err) {
        error = err;
      }

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateTaskCommand(task),
      );
      expect(result).toBeUndefined();
      expect((error as any).message).toEqual('Some Error');
    });
  });

  describe(`${TaskController.name}.deleteTask()`, () => {
    it('should call deleteTask success', async () => {
      const taskId = 'delete';

      const result = await controller.deleteTask(taskId);

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteTaskCommand(taskId),
      );
      expect(result).toBeUndefined();
    });

    it('should call deleteTask failure', async () => {
      const taskId = 'error';

      let result;
      let error;

      try {
        result = await controller.deleteTask(taskId);
      } catch (err) {
        error = err;
      }

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteTaskCommand(taskId),
      );
      // expect(result).toBeUndefined();
      expect((error as any).message).toEqual('Some Error');
    });
  });

  describe(`${TaskController.name}.getTask()`, () => {
    it('should call getTask success', async () => {
      const taskId = 'taskId';

      const result = await controller.getTask(taskId);

      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetTaskQuery(taskId));
      expect(result).toEqual({
        id: 'testid',
        title: 'title',
        description: 'description',
      });
    });

    it('should call getTask failure', async () => {
      const taskId = 'error';
      let result;
      let error;

      try {
        result = await controller.getTask(taskId);
      } catch (err) {
        error = err;
      }

      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetTaskQuery(taskId));
      expect(result).toBeUndefined();
      expect((error as any).message).toEqual('Some Error');
    });
  });

  describe(`${TaskController.name}.listAllTasks()`, () => {
    it('should call listAllTasks success', async () => {
      const result = await controller.listAllTasks();

      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(queryBus.execute).toHaveBeenCalledWith(new ListAllTasksQuery());
      expect(result).toEqual(
        expect.arrayContaining([
          {
            id: 'testid',
            title: 'test',
            description: 'test',
          },
        ]),
      );
    });

    it('should call listAllTasks failure', async () => {
      queryBus = {
        execute: jest.fn().mockImplementation(async args => {
          throw new Error('Some Error');
        }),
      } as any;

      const moduleRef = await Test.createTestingModule({
        imports: [CqrsModule],
        controllers: [TaskController],
      })
        .overrideProvider(QueryBus)
        .useValue(queryBus)
        .compile();

      controller = moduleRef.get<TaskController>(TaskController);
      let result;
      let error;

      try {
        result = await controller.listAllTasks();
      } catch (err) {
        error = err;
      }

      expect(queryBus.execute).toHaveBeenCalledTimes(1);
      expect(queryBus.execute).toHaveBeenCalledWith(new ListAllTasksQuery());
      expect(result).toBeUndefined();
      expect((error as any).message).toEqual('Some Error');
    });
  });
});
