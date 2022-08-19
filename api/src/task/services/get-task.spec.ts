import { Test } from '@nestjs/testing';
import { TaskRepository } from '../task.repository';
import { GetTaskService } from './get-task';

describe(GetTaskService.name, () => {
  let target: GetTaskService;
  let idTask!: string;
  let getAction: Function;

  beforeAll(async () => {
    getAction = jest.fn().mockImplementation(async args => {
      if (args === 'error') {
        throw new Error('Some Error');
      }
      return {
        id: idTask,
        title: 'title',
        description: 'description',
      };
    });
    const moduleRef = await Test.createTestingModule({
      providers: [TaskRepository, GetTaskService],
    })
      .overrideProvider(TaskRepository)
      .useValue({
        get: getAction,
      })
      .compile();

    target = moduleRef.get(GetTaskService);
  });

  beforeEach(() => {
    (getAction as jest.Mock).mockClear();
  });

  describe(`${GetTaskService.name}.create()`, () => {
    it('Should return success on get task', async () => {
      idTask = 'foo';

      const useCase = await target.get(idTask);

      expect(getAction).toHaveBeenCalledWith(idTask);
      expect(getAction).toHaveBeenCalledTimes(1);

      expect(useCase).toEqual({
        id: idTask,
        title: 'title',
        description: 'description',
      });
    });

    it('Should return error on get task', async () => {
      idTask = 'error';
      let error!: Error;
      let useCase;

      try {
        useCase = await target.get(idTask);
      } catch (err) {
        error = err as Error;
      }

      expect(getAction).toHaveBeenCalledWith(idTask);
      expect(getAction).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
