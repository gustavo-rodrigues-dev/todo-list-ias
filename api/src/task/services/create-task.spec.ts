import { Test } from '@nestjs/testing';
import { TaskRepository } from '../task.repository';
import { CreateTaskService } from './create-task';

describe(CreateTaskService.name, () => {
  let target: CreateTaskService;
  let idCreate!: string;
  let create: Function;

  beforeAll(async () => {
    create = jest.fn().mockImplementation(async args => {
      if (idCreate === 'error') {
        throw new Error('Some Error');
      }
      const result = {
        id: idCreate,
        ...args,
      };
      return result;
    });
    const moduleRef = await Test.createTestingModule({
      providers: [TaskRepository, CreateTaskService],
    })
      .overrideProvider(TaskRepository)
      .useValue({
        create,
      })
      .compile();

    target = moduleRef.get(CreateTaskService);
  });

  beforeEach(() => {
    (create as jest.Mock).mockClear();
  });

  describe(`${CreateTaskService.name}.create()`, () => {
    it('Should return task created on success save', async () => {
      idCreate = 'foo';
      const task = {
        title: 'Hello',
        description: 'Hello world!',
      };

      const useCase = await target.create(task);

      expect(create).toHaveBeenCalledWith(task);
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toEqual({
        id: idCreate,
        ...task,
      });
    });

    it('Should return error on save task repository', async () => {
      idCreate = 'error';
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

      expect(create).toHaveBeenCalledWith(task);
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
