import { CfnOutput } from 'aws-cdk-lib';
import { DockerImageFunction, DockerImageCode } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import path from 'path';
import { StackResource } from './stack-resource';
import { ToDoApiGateway, ToDoLambdaApi } from './resources';

export class ApiFunctionStack {
  constructor(stack: StackResource) {
    const apiFunction = new DockerImageFunction(stack, 'ApiLambda', {
      code: DockerImageCode.fromImageAsset(path.join(__dirname, '..', 'api'), {
        cmd: ['index.handleHello'],
        entrypoint: ['/lambda-entrypoint.sh'],
      }),
    });

    const apiGateway = new LambdaRestApi(stack, 'ToDoApi', {
      handler: apiFunction,
      proxy: true,
    });

    stack.resources.set(ToDoLambdaApi, apiFunction);
    stack.resources.set(ToDoApiGateway, apiGateway);

    stack.outPuts.set(ToDoLambdaApi, [
      new CfnOutput(apiFunction, 'ApiLambdaExport', {
        value: apiFunction.functionName,
        exportName: 'FunctionName',
      }),
    ]);

    stack.outPuts.set(ToDoApiGateway, [
      new CfnOutput(apiGateway, 'ApiGatewayExport', {
        value: apiGateway.restApiName,
        exportName: 'RestApiName',
      }),
    ]);
  }
}
