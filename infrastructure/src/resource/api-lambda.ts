import { CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { DockerImageFunction, DockerImageCode } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import path from 'path';
import { StackResource } from '../stack-resource';
import {
  ToDoApiGateway,
  ToDoBucket,
  ToDoDynamoDb,
  ToDoLambdaApi,
} from './resources';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export class ApiFunctionStack {
  constructor(stack: StackResource) {
    const bucket: Bucket | undefined = stack.resources.get(
      ToDoBucket,
    ) as Bucket;

    if (!bucket) {
      throw new Error(`Bucket ${ToDoBucket.toString()} is no available`);
    }

    const dynamodb: Table | undefined = stack.resources.get(
      ToDoDynamoDb,
    ) as Table;

    if (!dynamodb) {
      throw new Error(`Table ${ToDoDynamoDb.toString()} is no available`);
    }

    const apiFunction = new DockerImageFunction(stack, 'ApiLambda', {
      code: DockerImageCode.fromImageAsset(
        path.join(__dirname, '..', '..', '..', 'api'),
        {
          cmd: ['index.handle'],
          entrypoint: ['/lambda-entrypoint.sh'],
        },
      ),
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: dynamodb.tableName,
        DB_STUB: 'False',
        REGION: Stack.of(stack).region,
      },
      // eslint-disable-next-line no-magic-numbers
      timeout: Duration.seconds(120),
    });

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

    const dynamoDbTablePermissions = new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [`${dynamodb.tableArn}`],
      actions: [
        'dynamodb:BatchGet*',
        'dynamodb:DescribeStream',
        'dynamodb:DescribeTable',
        'dynamodb:Get*',
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:BatchWrite*',
        'dynamodb:CreateTable',
        'dynamodb:Delete*',
        'dynamodb:Update*',
        'dynamodb:PutItem',
      ],
    });

    apiFunction.addToRolePolicy(bucketContainerPermissions);
    apiFunction.addToRolePolicy(bucketPermissions);
    apiFunction.addToRolePolicy(dynamoDbTablePermissions);

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
