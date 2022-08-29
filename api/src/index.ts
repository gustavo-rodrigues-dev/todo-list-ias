require('./tracing');
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handle: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  try {
    if (!server) {
      server = server ?? (await bootstrap());
    }
    return await server(event, context, callback);
  } catch (error) {
    console.error(error);
    callback(null, JSON.stringify(error));
  }
};
