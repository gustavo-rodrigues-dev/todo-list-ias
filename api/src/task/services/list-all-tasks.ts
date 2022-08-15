import { Injectable } from '@nestjs/common';
import { TaskModel } from '../task.model';
import { TaskRepository } from '../task.repository';

@Injectable()
export class ListAllTasksService {
  constructor(private taskRepository: TaskRepository) {}
  get(): Promise<TaskModel[]> {
    return this.taskRepository.findAll();
  }
}
