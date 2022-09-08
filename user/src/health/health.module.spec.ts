import { HealthCheckService } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from './health.module';

describe(HealthModule.name, () => {
  let service: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
