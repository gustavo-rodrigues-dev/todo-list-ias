import { AppService } from './app.service';
import { bootstrap } from './main';

describe('bootstrap()', () => {
  it('Should load AppService ', async () => {
    const target = await bootstrap({
      logger: false,
    });
    expect(target.get(AppService)).toBeInstanceOf(AppService);
  });
});
