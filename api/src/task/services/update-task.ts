import { Injectable } from '@nestjs/common';
import { TaskDTO } from '../task.dto';
import { TaskRepository } from '../task.repository';

@Injectable()
export class UpdateTaskService {
  constructor(private taskRepository: TaskRepository) {}
  update(task: TaskDTO): Promise<TaskDTO> {
    return this.taskRepository.update(task);
  }
}
