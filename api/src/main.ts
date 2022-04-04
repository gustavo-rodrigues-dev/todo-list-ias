import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplicationContext } from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';

export async function bootstrap(
  options?: NestApplicationContextOptions,
): Promise<INestApplicationContext> {
  const app = await NestFactory.createApplicationContext(AppModule, options);
  return app;
}
