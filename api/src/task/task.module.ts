import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CreateTaskHandler } from './command/create-task.handler';
import { DeleteTaskHandler } from './command/delete-task.handler';
import { UpdateTaskHandler } from './command/update-task.handler';
import { CreatedTaskFailureHandler } from './event/created-task-failure.handler';
import { CreatedTaskSuccessHandler } from './event/created-task-success.handler';
import { DeletedTaskFailureHandler } from './event/deleted-task-failure.handler';
import { DeletedTaskSuccessHandler } from './event/deleted-task-success.handler';
import { GotTaskFailureHandler } from './event/got-task-failure.handler';
import { GotTaskSuccessHandler } from './event/got-task-success.handler';
import { ListedAllTasksFailureHandler } from './event/listed-all-tasks-failure.handler';
import { ListedAllTasksSuccessHandler } from './event/listed-all-tasks-success.handler';
import { UpdatedTaskFailureHandler } from './event/updated-task-failure.handler';
import { UpdatedTaskSuccessHandler } from './event/updated-task-success.handler';
import { GetTaskHandler } from './query/get-task.handler';
import { ListAllTasksHandler } from './query/list-all-tasks.handler';
import { CreateTaskService } from './services/create-task';
import { DeleteTaskService } from './services/delete-task';
import { GetTaskService } from './services/get-task';
import { ListAllTasksService } from './services/list-all-tasks';
import { UpdateTaskService } from './services/update-task';
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
    UpdateTaskService,
    UpdateTaskHandler,
    UpdatedTaskFailureHandler,
    UpdatedTaskSuccessHandler,
    DeleteTaskService,
    DeleteTaskHandler,
    DeletedTaskFailureHandler,
    DeletedTaskSuccessHandler,
    ListAllTasksService,
    ListAllTasksHandler,
    ListedAllTasksFailureHandler,
    ListedAllTasksSuccessHandler,
    GetTaskService,
    GetTaskHandler,
    GotTaskFailureHandler,
    GotTaskSuccessHandler,
  ],
  controllers: [TaskController],
})
export class TaskModule implements OnModuleInit {
  constructor(private readonly event$: EventBus) {}

  onModuleInit() {
    this.event$.register([
      CreatedTaskFailureHandler,
      CreatedTaskSuccessHandler,
      UpdatedTaskFailureHandler,
      UpdatedTaskSuccessHandler,
      DeletedTaskFailureHandler,
      DeletedTaskSuccessHandler,
      ListedAllTasksFailureHandler,
      ListedAllTasksSuccessHandler,
      GotTaskFailureHandler,
      GotTaskSuccessHandler,
    ]);
  }
}
