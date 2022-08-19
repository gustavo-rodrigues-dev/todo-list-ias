import { GetTaskQuery } from './get-task.query';
import { TaskDTO } from '../task.dto';

describe(GetTaskQuery.name, () => {
  describe(`${GetTaskQuery.name}.constructor()`, () => {
    it('Should return task success', async () => {
      const taskId = 'taskId';
      const target = new GetTaskQuery(taskId);
      expect(target).toBeInstanceOf(GetTaskQuery);
      expect(target.taskId).toEqual(taskId);
    });
  });
});
