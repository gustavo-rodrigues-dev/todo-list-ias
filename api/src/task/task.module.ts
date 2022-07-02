import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CreateTaskHandler } from './command/create-task.handler';
import { CreatedTaskFailureHandler } from './event/created-task-failure.handler';
import { CreatedTaskSuccessHandler } from './event/created-task-success.handler';
import { CreateTaskService } from './services/create-task';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskSchema } from './task.schema';
@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot(),
    DynamooseModule.forFeature([{ name: 'task', schema: TaskSchema }]),
  ],
  providers: [
    TaskRepository,
    CreateTaskService,
    CreateTaskHandler,
    CreatedTaskFailureHandler,
    CreatedTaskSuccessHandler,
  ],
  controllers: [TaskController],
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
