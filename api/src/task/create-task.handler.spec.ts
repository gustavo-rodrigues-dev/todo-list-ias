import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTaskHandler } from './create-task.handler';
import { CreateTaskService } from './services/create-task';

describe(CreateTaskHandler.name, () => {
  let target: CreateTaskHandler;
  let create: Function;
  beforeAll(async () => {
    create = jest.fn().mockImplementation(async args => {
      if (!!args.error) {
        throw new Error('Some Error');
      }
      const result = {
        id: 'testid',
        ...args,
      };
      return result;
    });

    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [CreateTaskService, CreateTaskHandler],
    })
      .overrideProvider(CreateTaskService)
      .useValue({
        create,
      })
      .compile();

    target = moduleRef.get<CreateTaskHandler>(CreateTaskHandler);
  });
  beforeEach(() => {
    (create as jest.Mock).mockClear();
  });

  describe(`${CreateTaskHandler.name}.execute()`, () => {
    it('Should return task created on execute handle', async () => {
      const command = {
        task: {
          title: 'Hello',
          description: 'Hello world!',
        },
      };

      const useCase = await target.execute(command);

      expect(create).toHaveBeenCalledWith(command.task);
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toEqual({
        id: 'testid',
        ...command.task,
      });
    });

    it('Should return error on execute handle', async () => {
      const command = {
        task: {
          title: 'Hello',
          description: 'Hello world!',
          error: true,
        },
      };

      let error!: Error;
      let useCase;

      try {
        useCase = await target.execute(command);
      } catch (err) {
        error = err as Error;
      }

      expect(create).toHaveBeenCalledWith(command.task);
      expect(create).toHaveBeenCalledTimes(1);

      expect(useCase).toBe(undefined);
      expect(error.message).toBe('Some Error');
    });
  });
});
