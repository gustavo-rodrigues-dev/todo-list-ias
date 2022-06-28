import { Test } from '@nestjs/testing';
import { DynamooseModule } from 'nestjs-dynamoose';
import { CreateTaskHandler } from './create-task.handler';
import { CreateTaskService } from './services/create-task';
import { TaskModule } from './task.module';
import { TaskRepository } from './task.repository';

describe(TaskModule.name, () => {
  let createTaskService: CreateTaskService;
  let createTaskHandler: CreateTaskHandler;
  let taskRepository: TaskRepository;
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
  });
});
