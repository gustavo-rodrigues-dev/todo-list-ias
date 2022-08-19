import { Test } from '@nestjs/testing';
import { TaskRepository } from '../task.repository';
import { UpdateTaskService } from './update-task';

describe(UpdateTaskService.name, () => {
  let target: UpdateTaskService;
  let update: Function;

  beforeAll(async () => {
    update = jest.fn().mockImplementation(async args => {
      if (args.id === 'error') {
        throw new Error('Some Error');
      }
      return args;
    });
    const moduleRef = await Test.createTestingModule({
      providers: [TaskRepository, UpdateTaskService],
    })
      .overrideProvider(TaskRepository)
      .useValue({
        update,
      })
      .compile();

    target = moduleRef.get(UpdateTaskService);
  });

  beforeEach(() => {
    (update as jest.Mock).mockClear();
  });

  describe(`${UpdateTaskService.name}.create()`, () => {
    it('Should return task updated on success save', async () => {
      const task = {
        id: 'foo',
        title: 'Hello',
        description: 'Hello world!',
      };

      const useCase = await target.update(task);

      expect(update).toHaveBeenCalledWith(task);
      expect(update).toHaveBeenCalledTimes(1);

      expect(useCase).toEqual(task);
    });

    it('Should return error on update task repository', async () => {
      const task = {
        id: 'error',
        title: 'Hello Error',
        description: 'Hello world wrong!',
      };
      let error!: Error;
      let useCase;

      try {
        useCase = await target.update(task);
      } catch (err) {
        error = err as Error;
      }

      expect(update).toHaveBeenCalledWith(task);
      expect(update).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
