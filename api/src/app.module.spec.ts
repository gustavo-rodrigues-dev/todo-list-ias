import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { CreateTaskService } from './task/services/create-task';
jest.useFakeTimers();

describe(AppModule.name, () => {
  let service: CreateTaskService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get<CreateTaskService>(CreateTaskService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
