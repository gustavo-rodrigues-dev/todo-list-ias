import { ValidationError } from 'class-validator';
import { UpdateTaskCommand } from '../command/update-task.command';

export class UpdatedTaskFailureEvent {
  constructor(
    public readonly command: UpdateTaskCommand,
    public readonly error: Error | Error[] | ValidationError[],
  ) {}
}
