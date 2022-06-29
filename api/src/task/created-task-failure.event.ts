import { ValidationError } from 'class-validator';
import { CreateTaskCommand } from './create-task.command';

export class CreatedTaskFailureEvent {
  constructor(
    public readonly command: CreateTaskCommand,
    public readonly error: Error | Error[] | ValidationError[],
  ) {}
}
