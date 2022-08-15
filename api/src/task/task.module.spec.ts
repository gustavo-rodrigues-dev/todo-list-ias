import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CreateTaskHandler } from './command/create-task.handler';
import { UpdateTaskHandler } from './command/update-task.handler';
import { DeleteTaskHandler } from './command/delete-task.handler';
import { GetTaskHandler } from './query/get-task.handler';
import { ListAllTasksHandler } from './query/list-all-tasks.handler';
import { CreatedTaskFailureHandler } from './event/created-task-failure.handler';
import { CreatedTaskSuccessHandler } from './event/created-task-success.handler';
import { CreateTaskService } from './services/create-task';
import { DeleteTaskService } from './services/delete-task';
import { GetTaskService } from './services/get-task';
import { ListAllTasksService } from './services/list-all-tasks';
import { UpdateTaskService } from './services/update-task';
import { TaskController } from './task.controller';
import { TaskModule } from './task.module';
import { TaskRepository } from './task.repository';
import { DeletedTaskFailureHandler } from './event/deleted-task-failure.handler';
import { UpdatedTaskSuccessHandler } from './event/updated-task-success.handler';
import { DeletedTaskSuccessHandler } from './event/deleted-task-success.handler';
import { GotTaskFailureHandler } from './event/got-task-failure.handler';
import { GotTaskSuccessHandler } from './event/got-task-success.handler';
import { ListedAllTasksFailureHandler } from './event/listed-all-tasks-failure.handler';
import { ListedAllTasksSuccessHandler } from './event/listed-all-tasks-success.handler';
import { UpdatedTaskFailureHandler } from './event/updated-task-failure.handler';
jest.useFakeTimers();
describe(TaskModule.name, () => {
  let moduleRef: TestingModule;
  let createTaskService: CreateTaskService;
  let updateTaskService: UpdateTaskService;
  let deleteTaskService: DeleteTaskService;
  let getTaskService: GetTaskService;
  let listAllTasksService: ListAllTasksService;
  let createTaskHandler: CreateTaskHandler;
  let updateTaskHandler: UpdateTaskHandler;
  let deleteTaskHandler: DeleteTaskHandler;
  let getTaskHandler: GetTaskHandler;
  let listAllTasksHandler: ListAllTasksHandler;
  let createdTaskFailureHandle: CreatedTaskFailureHandler;
  let createdTaskSuccessHandle: CreatedTaskSuccessHandler;
  let updatedTaskSuccessHandler: UpdatedTaskSuccessHandler;
  let updatedTaskFailureHandler: UpdatedTaskFailureHandler;
  let deletedTaskSuccessHandler: DeletedTaskSuccessHandler;
  let deletedTaskFailureHandler: DeletedTaskFailureHandler;
  let gotTaskSuccessHandler: GotTaskSuccessHandler;
  let gotTaskFailureHandler: GotTaskFailureHandler;
  let listedAllTasksSuccessHandler: ListedAllTasksSuccessHandler;
  let listedAllTasksFailureHandler: ListedAllTasksFailureHandler;
  let taskRepository: TaskRepository;
  let taskController: TaskController;
  let eventBus: EventBus;

  beforeAll(async () => {
    eventBus = {
      register: jest.fn().mockImplementation(() => {}),
    } as any;
    moduleRef = await Test.createTestingModule({
      imports: [
        DynamooseModule.forRoot({
          aws: {
            region: 'us-east-1',
          },
          local: true,
        }),
        TaskModule,
      ],
    })
      .overrideProvider(EventBus)
      .useValue(eventBus)
      .compile();

    createTaskService = moduleRef.get<CreateTaskService>(CreateTaskService);
    createTaskHandler = moduleRef.get<CreateTaskHandler>(CreateTaskHandler);
    updateTaskService = moduleRef.get<UpdateTaskService>(UpdateTaskService);
    updateTaskHandler = moduleRef.get<UpdateTaskHandler>(UpdateTaskHandler);
    deleteTaskService = moduleRef.get<DeleteTaskService>(DeleteTaskService);
    deleteTaskHandler = moduleRef.get<DeleteTaskHandler>(DeleteTaskHandler);
    getTaskService = moduleRef.get<GetTaskService>(GetTaskService);
    getTaskHandler = moduleRef.get<GetTaskHandler>(GetTaskHandler);
    listAllTasksService =
      moduleRef.get<ListAllTasksService>(ListAllTasksService);
    listAllTasksHandler =
      moduleRef.get<ListAllTasksHandler>(ListAllTasksHandler);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
    createdTaskFailureHandle = moduleRef.get<CreatedTaskFailureHandler>(
      CreatedTaskFailureHandler,
    );
    createdTaskSuccessHandle = moduleRef.get<CreatedTaskSuccessHandler>(
      CreatedTaskSuccessHandler,
    );
    updatedTaskSuccessHandler = moduleRef.get<UpdatedTaskSuccessHandler>(
      UpdatedTaskSuccessHandler,
    );
    updatedTaskFailureHandler = moduleRef.get<UpdatedTaskFailureHandler>(
      UpdatedTaskFailureHandler,
    );
    deletedTaskSuccessHandler = moduleRef.get<DeletedTaskSuccessHandler>(
      DeletedTaskSuccessHandler,
    );
    deletedTaskFailureHandler = moduleRef.get<DeletedTaskFailureHandler>(
      DeletedTaskFailureHandler,
    );
    gotTaskSuccessHandler = moduleRef.get<GotTaskSuccessHandler>(
      GotTaskSuccessHandler,
    );
    gotTaskFailureHandler = moduleRef.get<GotTaskFailureHandler>(
      GotTaskFailureHandler,
    );
    listedAllTasksSuccessHandler = moduleRef.get<ListedAllTasksSuccessHandler>(
      ListedAllTasksSuccessHandler,
    );
    listedAllTasksFailureHandler = moduleRef.get<ListedAllTasksFailureHandler>(
      ListedAllTasksFailureHandler,
    );
    taskController = moduleRef.get<TaskController>(TaskController);
  });

  describe(`${TaskModule.name}.imports()`, () => {
    it('Should module contains TaskRepository', () => {
      expect(taskRepository).toBeInstanceOf(TaskRepository);
    });

    it('Should module contains CreateTaskService', () => {
      expect(createTaskService).toBeInstanceOf(CreateTaskService);
    });

    it('Should module contains UpdateTaskService', () => {
      expect(updateTaskService).toBeInstanceOf(UpdateTaskService);
    });

    it('Should module contains DeleteTaskService', () => {
      expect(deleteTaskService).toBeInstanceOf(DeleteTaskService);
    });

    it('Should module contains GetTaskService', () => {
      expect(getTaskService).toBeInstanceOf(GetTaskService);
    });

    it('Should module contains ListAllTasksService', () => {
      expect(listAllTasksService).toBeInstanceOf(ListAllTasksService);
    });

    it('Should module contains CreateTaskHandler', () => {
      expect(createTaskHandler).toBeInstanceOf(CreateTaskHandler);
    });

    it('Should module contains UpdateTaskHandler', () => {
      expect(updateTaskHandler).toBeInstanceOf(UpdateTaskHandler);
    });

    it('Should module contains DeleteTaskHandler', () => {
      expect(deleteTaskHandler).toBeInstanceOf(DeleteTaskHandler);
    });

    it('Should module contains GetTaskHandler', () => {
      expect(getTaskHandler).toBeInstanceOf(GetTaskHandler);
    });

    it('Should module contains ListAllTasksHandler', () => {
      expect(listAllTasksHandler).toBeInstanceOf(ListAllTasksHandler);
    });

    it('Should module contains CreatedTaskFailureHandler', () => {
      expect(createdTaskFailureHandle).toBeInstanceOf(
        CreatedTaskFailureHandler,
      );
    });

    it('Should module contains UpdatedTaskFailureHandler', () => {
      expect(updatedTaskFailureHandler).toBeInstanceOf(
        UpdatedTaskFailureHandler,
      );
    });

    it('Should module contains DeletedTaskFailureHandler', () => {
      expect(deletedTaskFailureHandler).toBeInstanceOf(
        DeletedTaskFailureHandler,
      );
    });

    it('Should module contains GotTaskFailureHandler', () => {
      expect(gotTaskFailureHandler).toBeInstanceOf(GotTaskFailureHandler);
    });

    it('Should module contains ListedAllTasksFailureHandler', () => {
      expect(listedAllTasksFailureHandler).toBeInstanceOf(
        ListedAllTasksFailureHandler,
      );
    });

    it('Should module contains CreatedTaskSuccessHandler', () => {
      expect(createdTaskSuccessHandle).toBeInstanceOf(
        CreatedTaskSuccessHandler,
      );
    });

    it('Should module contains UpdatedTaskSuccessHandler', () => {
      expect(updatedTaskSuccessHandler).toBeInstanceOf(
        UpdatedTaskSuccessHandler,
      );
    });

    it('Should module contains DeletedTaskSuccessHandler', () => {
      expect(deletedTaskSuccessHandler).toBeInstanceOf(
        DeletedTaskSuccessHandler,
      );
    });

    it('Should module contains GotTaskSuccessHandler', () => {
      expect(gotTaskSuccessHandler).toBeInstanceOf(GotTaskSuccessHandler);
    });

    it('Should module contains ListedAllTasksSuccessHandler', () => {
      expect(listedAllTasksSuccessHandler).toBeInstanceOf(
        ListedAllTasksSuccessHandler,
      );
    });

    it('Should module contains TaskController', () => {
      expect(taskController).toBeInstanceOf(TaskController);
    });
  });
});
