import { GetTaskQuery } from '../query/get-task.query';
import { TaskDTO } from '../task.dto';

export class GotTaskSuccessEvent {
  constructor(
    public readonly query: GetTaskQuery,
    public readonly result: TaskDTO,
  ) {}
}
