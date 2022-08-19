import { DeleteTaskCommand } from './delete-task.command';
import { TaskDTO } from '../task.dto';

describe(DeleteTaskCommand.name, () => {
  describe(`${DeleteTaskCommand.name}.constructor()`, () => {
    it('Should return task success', async () => {
      const taskId = 'taskId';
      const target = new DeleteTaskCommand(taskId);
      expect(target).toBeInstanceOf(DeleteTaskCommand);
      expect(target.taskId).toEqual(taskId);
    });
  });
});
