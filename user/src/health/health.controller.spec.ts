import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthModule } from './health.module';

describe(HealthController.name, () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
