import { ValidationError } from 'class-validator';
import { GetTaskQuery } from '../query/get-task.query';

export class GotTaskFailureEvent {
  constructor(
    public readonly query: GetTaskQuery,
    public readonly error: Error | Error[] | ValidationError[],
  ) {}
}
