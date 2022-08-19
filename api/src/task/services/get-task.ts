import { Injectable } from '@nestjs/common';
import { TaskModel } from '../task.model';
import { TaskRepository } from '../task.repository';

@Injectable()
export class GetTaskService {
  constructor(private taskRepository: TaskRepository) {}
  get(id: string): Promise<TaskModel> {
    return this.taskRepository.get(id);
  }
}
