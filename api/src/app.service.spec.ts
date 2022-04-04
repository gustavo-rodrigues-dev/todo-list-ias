import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe(AppService.name, () => {
  let target: AppService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    target = moduleRef.get(AppService);
  });

  describe('getHello()', () => {
    it('Should return "Hello Word"', () => {
      const hello = target.getHello();

      expect(hello).toBe('Hello world!');
    });
  });
});
