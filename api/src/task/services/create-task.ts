import { Injectable } from '@nestjs/common';
import { TaskDTO } from '../task.dto';
import { TaskRepository } from '../task.repository';

@Injectable()
export class CreateTaskService {
  constructor(private taskRepository: TaskRepository) {}
  create(task: TaskDTO): Promise<TaskDTO> {
    return this.taskRepository.create(task);
  }
}
