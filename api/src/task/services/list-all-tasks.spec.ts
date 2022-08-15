import { Test } from '@nestjs/testing';
import { TaskRepository } from '../task.repository';
import { ListAllTasksService } from './list-all-tasks';

describe(ListAllTasksService.name, () => {
  let target: ListAllTasksService;
  let findAll: Function;

  beforeAll(async () => {
    findAll = jest.fn().mockImplementation(async args => {
      return [
        {
          id: 'idTask',
          title: 'title',
          description: 'description',
        },
      ];
    });
    const moduleRef = await Test.createTestingModule({
      providers: [TaskRepository, ListAllTasksService],
    })
      .overrideProvider(TaskRepository)
      .useValue({
        findAll: findAll,
      })
      .compile();

    target = moduleRef.get(ListAllTasksService);
  });

  beforeEach(() => {
    (findAll as jest.Mock).mockClear();
  });

  describe(`${ListAllTasksService.name}.create()`, () => {
    it('Should return success on list all task', async () => {
      const useCase = await target.get();

      expect(findAll).toHaveBeenCalledWith();
      expect(findAll).toHaveBeenCalledTimes(1);

      expect(useCase).toEqual(
        expect.arrayContaining([
          {
            id: 'idTask',
            title: 'title',
            description: 'description',
          },
        ]),
      );
    });

    it('Should return error on get task', async () => {
      findAll = jest.fn().mockImplementation(async args => {
        throw new Error('Some Error');
      });
      const moduleRef = await Test.createTestingModule({
        providers: [TaskRepository, ListAllTasksService],
      })
        .overrideProvider(TaskRepository)
        .useValue({
          findAll: findAll,
        })
        .compile();

      target = moduleRef.get(ListAllTasksService);
      let error!: Error;
      let useCase;

      try {
        useCase = await target.get();
      } catch (err) {
        error = err as Error;
      }

      expect(findAll).toHaveBeenCalledWith();
      expect(findAll).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
