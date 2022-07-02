import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { CreateTaskCommand } from './command/create-task.command';
import { TaskController } from './task.controller';

describe(TaskController.name, () => {
  let controller: TaskController;
  let commandBus: CommandBus;

  beforeAll(async () => {
    commandBus = {
      execute: jest.fn().mockImplementation(async args => {
        if (args.task.title === 'error') {
          throw new Error('Some Error');
        }

        const result = {
          id: 'testid',
          ...args.task,
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
      .compile();

    controller = moduleRef.get<TaskController>(TaskController);
  });

  beforeEach(() => {
    (commandBus.execute as jest.Mock).mockClear();
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
});
