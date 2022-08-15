import { ListAllTasksQuery } from './list-all-tasks.query';

describe(ListAllTasksQuery.name, () => {
  describe(`${ListAllTasksQuery.name}.constructor()`, () => {
    it('Should return task success', async () => {
      const target = new ListAllTasksQuery();
      expect(target).toBeInstanceOf(ListAllTasksQuery);
      expect(target).toEqual({});
    });
  });
});
