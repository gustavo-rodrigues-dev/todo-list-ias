import { CfnOutput } from 'aws-cdk-lib';
import { DockerImageFunction, DockerImageCode } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import path from 'path';
import { StackResource } from '../stack-resource';
import { ToDoApiGateway, ToDoBucket, ToDoLambdaApi } from './resources';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class ApiFunctionStack {
  constructor(stack: StackResource) {
    const bucket: Bucket | undefined = stack.resources.get(
      ToDoBucket,
    ) as Bucket;
    const apiFunction = new DockerImageFunction(stack, 'ApiLambda', {
      code: DockerImageCode.fromImageAsset(
        path.join(__dirname, '..', '..', 'api'),
        {
          cmd: ['index.handleHello'],
          entrypoint: ['/lambda-entrypoint.sh'],
        },
      ),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    if (!bucket) {
      throw new Error(`Bucket ${ToDoBucket.toString()} is no available`);
    }

    const bucketContainerPermissions = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [bucket.bucketArn],
      actions: ['S3:ListBucket'],
    });

    const bucketPermissions = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [`${bucket.bucketArn}/*`],
      actions: ['S3:GetObject', 'S3:PutObject'],
    });

    apiFunction.addToRolePolicy(bucketContainerPermissions);
    apiFunction.addToRolePolicy(bucketPermissions);

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
