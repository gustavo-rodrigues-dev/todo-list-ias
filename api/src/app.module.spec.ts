import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppService } from './app.service';
jest.useFakeTimers();

describe(AppModule.name, () => {
  let service: AppService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleRef.get<AppService>(AppService);
  });

  describe(`${AppModule.name}.imports()`, () => {
    it('Should module contains AppService ', () => {
      expect(service).toBeInstanceOf(AppService);
    });
  });
});
