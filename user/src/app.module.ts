import { Module } from '@nestjs/common';
import configuration from './config';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CqrsModule,
    HealthModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
