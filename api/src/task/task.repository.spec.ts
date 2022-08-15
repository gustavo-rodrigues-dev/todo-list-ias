import { TaskRepository } from './task.repository';
import * as uuid from 'uuid';
import { TaskKey, TaskModel } from './task.model';
jest.useFakeTimers();
jest.mock('uuid');

describe(TaskRepository.name, () => {
  let target: TaskRepository;
  let create: Function;
  let update: Function;
  let deleteAction: Function;
  let scan: any;
  let execution: Function;
  let get: Function;

  beforeAll(async () => {
    jest.spyOn(uuid, 'v4').mockReturnValue('testid');
    create = jest.fn().mockImplementation(async args => {
      const result = {
        done: false,
        ...args,
      };
      return result;
    });

    update = jest.fn().mockImplementation(async (id, args) => {
      const result = {
        ...args,
      };
      return result;
    });

    get = jest.fn().mockImplementation(async (taskKey: TaskKey) => {
      const result = {
        id: taskKey.id,
        title: 'test',
        description: 'test',
        done: false,
      };
      return result;
    });

    execution = jest.fn().mockImplementation(async () => {
      return [
        {
          id: 'testid',
          title: 'test',
          description: 'test',
          done: false,
        },
      ];
    });

    scan = () => {
      return { exec: execution };
    };

    deleteAction = jest.fn().mockImplementation(async id => {
      return;
    });

    const taskModel = {
      create,
      get,
      update,
      delete: deleteAction,
      scan,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target = new TaskRepository(taskModel as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target as any).taskModel = taskModel;
  });

  beforeEach(() => {
    (create as jest.Mock).mockClear();
    (get as jest.Mock).mockClear();
    (update as jest.Mock).mockClear();
    (execution as jest.Mock).mockClear();
  });

  describe(`${TaskRepository.name}.create()`, () => {
    it('Should return task created on success save', async () => {
      const task = {
        title: 'Hello',
        description: 'Hello world!',
      };

      const useCase = await target.create(task);

      expect(create).toHaveBeenCalledWith({
        ...task,
        id: 'testid',
        done: false,
      });
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toMatchObject({
        id: 'testid',
        done: false,
        ...task,
      });
    });

    it('Should return error on save task repository', async () => {
      create = jest.fn().mockImplementation(async () => {
        throw new Error('Some Error');
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any).taskModel.create = create;
      const task = {
        title: 'Hello Error',
        description: 'Hello world wrong!',
      };
      let error!: Error;
      let useCase;

      try {
        useCase = await target.create(task);
      } catch (err) {
        error = err as Error;
      }

      expect(create).toHaveBeenCalledWith({
        ...task,
        id: 'testid',
        done: false,
      });
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });

  describe(`${TaskRepository.name}.get()`, () => {
    beforeEach(() => {
      (get as jest.Mock).mockClear();
    });
    it('Should return task success on get', async () => {
      const taskKey = {
        id: 'testid',
      } as TaskKey;

      const useCase = await target.get(taskKey.id);

      expect(get).toHaveBeenCalledWith({ ...taskKey });
      expect(get).toHaveBeenCalledTimes(1);

      expect(useCase).toMatchObject({
        id: taskKey.id,
        title: 'test',
        description: 'test',
      });
    });

    it('Should return error on get task repository', async () => {
      get = jest.fn().mockImplementation(async () => {
        throw new Error('Some Error');
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any).taskModel.get = get;
      const taskKey = {
        id: 'testid',
      } as TaskKey;
      let error!: Error;
      let useCase;

      try {
        useCase = await target.get(taskKey.id);
      } catch (err) {
        error = err as Error;
      }

      expect(get).toHaveBeenCalledWith({ ...taskKey });
      expect(get).toHaveBeenCalledTimes(1);
      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });

  describe(`${TaskRepository.name}.findAll()`, () => {
    beforeEach(() => {
      (execution as jest.Mock).mockClear();
    });
    it('Should return task success on findAll', async () => {
      const useCase = await target.findAll();

      expect(execution).toHaveBeenCalledWith();
      expect(execution).toHaveBeenCalledTimes(1);
      expect(useCase.length).toBe(1);
      expect(useCase[0]).toMatchObject({
        title: 'test',
        description: 'test',
      });
    });

    it('Should return error on findAll task repository', async () => {
      execution = jest.fn().mockImplementation(async () => {
        throw new Error('Some Error');
      });
      scan = () => {
        return {
          exec: execution,
        };
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any).taskModel.scan = scan;
      let error!: Error;
      let useCase;

      try {
        useCase = await target.findAll();
      } catch (err) {
        error = err as Error;
      }

      expect(execution).toHaveBeenCalledWith();
      expect(execution).toHaveBeenCalledTimes(1);
      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });

  describe(`${TaskRepository.name}.update()`, () => {
    beforeEach(() => {
      (update as jest.Mock).mockClear();
    });
    it('Should return task updated success on update', async () => {
      const task = {
        id: 'testid',
        title: 'Hello',
        description: 'Hello world!',
      } as TaskModel;

      const useCase = await target.update(task);

      expect(update).toHaveBeenCalledWith({ id: task.id }, { ...task });
      expect(update).toHaveBeenCalledTimes(1);

      expect(useCase).toMatchObject({
        ...task,
      });
    });

    it('Should return error on update task repository', async () => {
      const task = {
        title: 'Hello Error',
        description: 'Hello world wrong!',
      } as TaskModel;
      let error!: Error;
      let useCase;

      try {
        useCase = await target.update(task);
      } catch (err) {
        error = err as Error;
      }

      expect(update).toHaveBeenCalledTimes(0);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Task id is required');
    });
  });

  describe(`${TaskRepository.name}.delete()`, () => {
    beforeEach(() => {
      (deleteAction as jest.Mock).mockClear();
    });
    it('Should return task deleted success on delete', async () => {
      const taskKey = {
        id: 'testid',
      } as TaskKey;

      const useCase = await target.delete(taskKey.id);

      expect(deleteAction).toHaveBeenCalledWith({ ...taskKey });
      expect(deleteAction).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
    });

    it('Should return error on delete task repository', async () => {
      deleteAction = jest.fn().mockImplementation(async () => {
        throw new Error('Some Error');
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any).taskModel.delete = deleteAction;
      const taskKey = {
        id: 'testid',
      } as TaskKey;
      let error!: Error;
      let useCase;

      try {
        useCase = await target.delete(taskKey.id);
      } catch (err) {
        error = err as Error;
      }

      expect(deleteAction).toHaveBeenCalledWith({ ...taskKey });
      expect(deleteAction).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
