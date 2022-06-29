import { Test } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CreateTaskHandler } from './create-task.handler';
import { CreatedTaskFailureHandler } from './created-task-failure.handler';
import { CreatedTaskSuccessHandler } from './created-task-success.handler';
import { CreateTaskService } from './services/create-task';
import { TaskModule } from './task.module';
import { TaskRepository } from './task.repository';
jest.useFakeTimers();
describe(TaskModule.name, () => {
  let createTaskService: CreateTaskService;
  let createTaskHandler: CreateTaskHandler;
  let taskRepository: TaskRepository;
  let createdTaskFailureHandle: CreatedTaskFailureHandler;
  let createdTaskSuccessHandle: CreatedTaskSuccessHandler;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DynamooseModule.forRoot({
          aws: {
            region: 'us-east-1',
          },
          local: true,
        }),
        TaskModule,
      ],
    }).compile();

    createTaskService = moduleRef.get<CreateTaskService>(CreateTaskService);
    createTaskHandler = moduleRef.get<CreateTaskHandler>(CreateTaskHandler);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
    createdTaskFailureHandle = moduleRef.get<CreatedTaskFailureHandler>(
      CreatedTaskFailureHandler,
    );
    createdTaskSuccessHandle = moduleRef.get<CreatedTaskSuccessHandler>(
      CreatedTaskSuccessHandler,
    );
  });

  describe(`${TaskModule.name}.imports()`, () => {
    it('Should module contains CreateTaskService', () => {
      expect(createTaskService).toBeInstanceOf(CreateTaskService);
    });

    it('Should module contains CreateTaskHandler', () => {
      expect(createTaskHandler).toBeInstanceOf(CreateTaskHandler);
    });

    it('Should module contains TaskRepository', () => {
      expect(taskRepository).toBeInstanceOf(TaskRepository);
    });

    it('Should module contains CreatedTaskFailureHandler', () => {
      expect(createdTaskFailureHandle).toBeInstanceOf(
        CreatedTaskFailureHandler,
      );
    });

    it('Should module contains CreatedTaskSuccessHandler', () => {
      expect(createdTaskSuccessHandle).toBeInstanceOf(
        CreatedTaskSuccessHandler,
      );
    });
  });
});
