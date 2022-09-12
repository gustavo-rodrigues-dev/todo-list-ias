import { StackResource } from './stack-resource';
import {
  StackProps,
  Tags,
  CfnOutput,
  Resource,
  Stack as CDKStack,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  S3BucketStack,
  ToDoStack,
  ApiFunctionStack,
  DynamoDbStack,
} from './resource';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Stack extends CDKStack implements StackResource {
  public resources: Map<string | Symbol, Resource> = new Map();
  public outPuts: Map<string | Symbol, [CfnOutput]> = new Map();
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const self = this;
    Tags.of(scope).add('project', 'to-do-stack');

    new S3BucketStack(self);
    new DynamoDbStack(self);
    new ApiFunctionStack(self);
    this.outPuts.set(ToDoStack, [
      new CfnOutput(self, 'ToDoStackCreate', {
        value: id,
        exportName: 'StackId',
      }),
    ]);
  }
}
