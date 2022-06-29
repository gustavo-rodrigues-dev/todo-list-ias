import { validateSync } from 'class-validator';
import { TaskDTO } from './task.dto';
export class CreateTaskCommand {
  public name: string = 'createtask';
  constructor(public task: TaskDTO) {
    const error = validateSync(task);
    if (error.length > 0) {
      throw error;
    }
  }
}
