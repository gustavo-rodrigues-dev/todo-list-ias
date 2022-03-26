import { CfnOutput } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import path from 'path';
import { StackResource } from './stack-resource';
import { ToDoApiGateway, ToDoLambdaApi } from './resources';

export class ApiFunctionStack {
  readonly apiFunction: NodejsFunction;
  readonly apiGateway: LambdaRestApi;
  constructor(stack: StackResource) {
    const apiFunction = new NodejsFunction(stack, 'ApiLambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, '..', 'api', 'src', 'index.ts'),
      handler: 'handleHello',
      depsLockFilePath: path.join(__dirname, '..', 'api', 'package-lock.json'),
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
