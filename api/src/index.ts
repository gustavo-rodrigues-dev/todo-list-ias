import {
  APIGatewayProxyEventV2,
  Context,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { bootstrap } from './main';
import { AppService } from './app.service';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';

export const handleHello = async (
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  event?: APIGatewayProxyEventV2,
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  context?: Context,
  options?: NestApplicationContextOptions,
): Promise<APIGatewayProxyResultV2> => {
  const app = await bootstrap(options);
  const service = app.get(AppService);
  const result: APIGatewayProxyResultV2 = {
    statusCode: 200,
    body: service.getHello(),
  };

  return result;
};
