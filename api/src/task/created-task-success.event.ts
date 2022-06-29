import { CreateTaskCommand } from './create-task.command';
import { TaskDTO } from './task.dto';

export class CreatedTaskSuccessEvent {
  constructor(
    public readonly command: CreateTaskCommand,
    public readonly result: TaskDTO,
  ) {}
}
