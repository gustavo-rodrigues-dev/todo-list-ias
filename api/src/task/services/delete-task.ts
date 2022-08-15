import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../task.repository';

@Injectable()
export class DeleteTaskService {
  constructor(private taskRepository: TaskRepository) {}
  delete(id: string): Promise<void> {
    return this.taskRepository.delete(id);
  }
}
