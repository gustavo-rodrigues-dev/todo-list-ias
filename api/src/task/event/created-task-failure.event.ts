import { ValidationError } from 'class-validator';
import { CreateTaskCommand } from '../command/create-task.command';

export class CreatedTaskFailureEvent {
  constructor(
    public readonly command: CreateTaskCommand,
    public readonly error: Error | Error[] | ValidationError[],
  ) {}
}
