import { Test } from '@nestjs/testing';
import { TaskRepository } from '../task.repository';
import { DeleteTaskService } from './delete-task';

describe(DeleteTaskService.name, () => {
  let target: DeleteTaskService;
  let idTask!: string;
  let deleteAction: Function;

  beforeAll(async () => {
    deleteAction = jest.fn().mockImplementation(async args => {
      if (args === 'error') {
        throw new Error('Some Error');
      }
      return undefined;
    });
    const moduleRef = await Test.createTestingModule({
      providers: [TaskRepository, DeleteTaskService],
    })
      .overrideProvider(TaskRepository)
      .useValue({
        delete: deleteAction,
      })
      .compile();

    target = moduleRef.get(DeleteTaskService);
  });

  beforeEach(() => {
    (deleteAction as jest.Mock).mockClear();
  });

  describe(`${DeleteTaskService.name}.create()`, () => {
    it('Should return success on delete task', async () => {
      idTask = 'foo';

      const useCase = await target.delete(idTask);

      expect(deleteAction).toHaveBeenCalledWith(idTask);
      expect(deleteAction).toHaveBeenCalledTimes(1);

      expect(useCase).toEqual(undefined);
    });

    it('Should return error on delete task', async () => {
      idTask = 'error';
      let error!: Error;
      let useCase;

      try {
        useCase = await target.delete(idTask);
      } catch (err) {
        error = err as Error;
      }

      expect(deleteAction).toHaveBeenCalledWith(idTask);
      expect(deleteAction).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
