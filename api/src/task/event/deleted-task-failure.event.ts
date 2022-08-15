import { ValidationError } from 'class-validator';
import { DeleteTaskCommand } from '../command/delete-task.command';

export class DeletedTaskFailureEvent {
  constructor(
    public readonly command: DeleteTaskCommand,
    public readonly error: Error | Error[] | ValidationError[],
  ) {}
}
