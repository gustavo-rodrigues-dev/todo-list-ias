import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CreateTaskHandler } from './create-task.handler';
import { CreateTaskService } from './services/create-task';
import { TaskRepository } from './task.repository';
import { TaskSchema } from './task.schema';
@Module({
  imports: [DynamooseModule.forFeature([{ name: 'Task', schema: TaskSchema }])],
  providers: [TaskRepository, CreateTaskService, CreateTaskHandler],
})
export class TaskModule {}
