import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { TaskDTO } from './task.dto';
import { TaskKey, TaskModel } from './task.model';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel('task')
    private taskModel: Model<TaskModel, TaskKey>,
  ) {}

  async create(input: TaskDTO): Promise<TaskModel> {
    const task = { done: false, ...input, id: uuidv4() } as TaskModel;
    return await this.taskModel.create(task);
  }

  async get(id: string): Promise<TaskModel> {
    return await this.taskModel.get({ id });
  }

  async findAll(): Promise<TaskModel[]> {
    return await this.taskModel.scan().exec();
  }

  async update(task: TaskDTO): Promise<TaskModel> {
    if (!task.id) {
      throw new Error('Task id is required');
    }
    return await this.taskModel.update(task as TaskModel);
  }

  async delete(id: string): Promise<void> {
    return await this.taskModel.delete({ id });
  }
}
