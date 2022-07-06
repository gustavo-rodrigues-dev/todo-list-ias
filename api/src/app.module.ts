import { DynamooseModule } from 'nestjs-dynamoose';
import { Module } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import configuration from './config';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DynamooseModule.forRoot({
      ddb: new DynamoDB({
        region: configuration().region,
        endpoint: process.env.AWS_SAM_LOCAL
          ? 'http://dynamodb:8000'
          : `https://dynamodb.${configuration().region}.amazonaws.com`,
      }),
    }),
    CqrsModule,
    TaskModule,
  ],
  providers: [],
})
export class AppModule {}
