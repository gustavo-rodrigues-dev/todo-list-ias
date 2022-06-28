import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { TaskDTO } from './task.dto';
import { TaskKey, TaskModel } from './task.model';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel('Task')
    private taskModel: Model<TaskModel, TaskKey>,
  ) {}

  async create(input: TaskDTO) {
    const task = { ...input, id: uuidv4() } as TaskModel;
    return await this.taskModel.create(task);
  }
}
