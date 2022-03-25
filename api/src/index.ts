import {
    APIGatewayProxyEventV2,
    Context,
    APIGatewayProxyResultV2,
} from 'aws-lambda';

// eslint-disable-next-line unused-imports/no-unused-vars-ts
export const handleHello = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
    const result: APIGatewayProxyResultV2 = {
        statusCode: 200,
        body: 'hello',
    };

    return result;
};
