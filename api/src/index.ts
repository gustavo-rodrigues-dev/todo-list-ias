import {
    APIGatewayProxyEventV2,
    Context,
    APIGatewayProxyResultV2,
} from 'aws-lambda';
import { bootstrap } from './main';
import { AppService } from './app.service';

// eslint-disable-next-line unused-imports/no-unused-vars-ts
export const handleHello = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
    const app = await bootstrap();
    const service = app.get(AppService);
    const result: APIGatewayProxyResultV2 = {
        statusCode: 200,
        body: service.getHello(),
    };

    return result;
};
