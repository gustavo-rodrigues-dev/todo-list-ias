import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CreateTaskHandler } from './create-task.handler';
import { CreatedTaskFailureHandler } from './created-task-failure.handler';
import { CreatedTaskSuccessHandler } from './created-task-success.handler';
import { CreateTaskService } from './services/create-task';
import { TaskRepository } from './task.repository';
import { TaskSchema } from './task.schema';
@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot(),
    DynamooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
  ],
  providers: [
    TaskRepository,
    CreateTaskService,
    CreateTaskHandler,
    CreatedTaskFailureHandler,
    CreatedTaskSuccessHandler,
  ],
})
export class TaskModule implements OnModuleInit {
  constructor(private readonly event$: EventBus) {}

  onModuleInit() {
    this.event$.register([
      CreatedTaskFailureHandler,
      CreatedTaskSuccessHandler,
    ]);
  }
}
