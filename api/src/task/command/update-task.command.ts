import { validateSync } from 'class-validator';
import { TaskDTO } from '../task.dto';
export class UpdateTaskCommand {
  constructor(public task: TaskDTO) {
    const error = validateSync(task);
    if (error.length > 0) {
      throw error;
    }
  }
}
