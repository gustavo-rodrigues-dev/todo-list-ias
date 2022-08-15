import { ListAllTasksQuery } from '../query/list-all-tasks.query';
import { TaskDTO } from '../task.dto';

export class ListedAllTasksSuccessEvent {
  constructor(
    public readonly query: ListAllTasksQuery,
    public readonly result: TaskDTO[],
  ) {}
}
