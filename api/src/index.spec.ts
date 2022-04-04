import { handleHello } from '.';

describe('handleHello()', () => {
  it('Should load AppService ', async () => {
    const target = await handleHello(undefined, undefined, {
      logger: false,
    });

    expect(target).toEqual({
      statusCode: 200,
      body: 'Hello world!',
    });
  });
});
