import { ValidationError } from 'class-validator';
import { UpdateTaskCommand } from './update-task.command';
import { TaskDTO } from '../task.dto';

describe(UpdateTaskCommand.name, () => {
  describe(`${UpdateTaskCommand.name}.constructor()`, () => {
    it('Should Update UpdateTaskCommand success', async () => {
      const task = new TaskDTO();
      task.id = 'taskId';
      task.title = 'Hello';
      task.description = 'Hello world!';
      const target = new UpdateTaskCommand(task);
      expect(target).toBeInstanceOf(UpdateTaskCommand);
      expect(target.task).toEqual(task);
    });

    it('Should Update UpdateTaskCommand error', async () => {
      const task = new TaskDTO();
      let target!: UpdateTaskCommand;
      let error!: ValidationError;
      task.id = 'taskId';
      task.title = 'He';
      task.description = 'He';

      try {
        target = new UpdateTaskCommand(task);
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
