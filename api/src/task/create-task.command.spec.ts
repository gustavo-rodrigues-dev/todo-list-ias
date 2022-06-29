import { ValidationError } from 'class-validator';
import { CreateTaskCommand } from './create-task.command';
import { TaskDTO } from './task.dto';

describe(CreateTaskCommand.name, () => {
  describe(`${TaskDTO.name}.constructor()`, () => {
    it('Should create CreateTaskCommand success', async () => {
      const task = new TaskDTO();
      task.title = 'Hello';
      task.description = 'Hello world!';
      const target = new CreateTaskCommand(task);
      expect(target).toBeInstanceOf(CreateTaskCommand);
      expect(target.task).toEqual(task);
    });

    it('Should create CreateTaskCommand error', async () => {
      const task = new TaskDTO();
      let target!: CreateTaskCommand;
      let error!: ValidationError;
      task.title = 'He';
      task.description = 'He';

      try {
        target = new CreateTaskCommand(task);
      } catch (err) {
        error = err as ValidationError;
      }
      expect(target).toBeUndefined();
      expect(error.toString().replace(/\n|\r/g, '').trim().trim()).toBe(
        'An instance of TaskDTO has failed the validation:' +
          ' - property title has failed the following constraints: isLength' +
          ' ,An instance of TaskDTO has failed the validation:' +
          ' - property description has failed the following constraints: isLength',
      );
    });
  });
});
