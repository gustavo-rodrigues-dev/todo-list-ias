import { DynamooseModule } from 'nestjs-dynamoose';
import { Module } from '@nestjs/common';
import configuration from './config';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DynamooseModule.forRoot({
      aws: {
        region: configuration().region,
      },
      local: configuration().database.isNotStub,
    }),
    CqrsModule,
    TaskModule,
  ],
  providers: [AppService],
})
export class AppModule {}
