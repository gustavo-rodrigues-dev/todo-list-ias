import { ValidationError } from 'class-validator';
import { ListAllTasksQuery } from '../query/list-all-tasks.query';

export class ListedAllTasksFailureEvent {
  constructor(
    public readonly query: ListAllTasksQuery,
    public readonly error: Error | Error[] | ValidationError[],
  ) {}
}
