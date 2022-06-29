import { TaskRepository } from './task.repository';
import * as uuid from 'uuid';
jest.useFakeTimers();
jest.mock('uuid');
describe(TaskRepository.name, () => {
  let target: TaskRepository;
  let create: Function;

  beforeAll(async () => {
    jest.spyOn(uuid, 'v4').mockReturnValue('testid');
    create = jest.fn().mockImplementation(async args => {
      const result = {
        ...args,
      };
      return result;
    });
    const taskModel = {
      create,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target = new TaskRepository(taskModel as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target as any).taskModel = taskModel;
  });

  beforeEach(() => {
    (create as jest.Mock).mockClear();
  });

  describe(`${TaskRepository.name}.create()`, () => {
    it('Should return task created on success save', async () => {
      const task = {
        title: 'Hello',
        description: 'Hello world!',
      };

      const useCase = await target.create(task);

      expect(create).toHaveBeenCalledWith({ ...task, id: 'testid' });
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toMatchObject({
        id: 'testid',
        ...task,
      });
    });

    it('Should return error on save task repository', async () => {
      create = jest.fn().mockImplementation(async () => {
        throw new Error('Some Error');
      });
      const taskModel = {
        create,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (target as any).taskModel = taskModel;
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

      expect(create).toHaveBeenCalledWith({ ...task, id: 'testid' });
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
