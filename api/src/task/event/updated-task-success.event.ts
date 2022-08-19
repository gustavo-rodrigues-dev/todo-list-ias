import { UpdateTaskCommand } from '../command/update-task.command';
import { TaskDTO } from '../task.dto';

export class UpdatedTaskSuccessEvent {
  constructor(
    public readonly command: UpdateTaskCommand,
    public readonly result: TaskDTO,
  ) {}
}
