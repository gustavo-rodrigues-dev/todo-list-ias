import { Stack, Resource, CfnOutput } from 'aws-cdk-lib/core';

export interface StackResource extends Stack {
  resources: Map<string | Symbol, Resource>;
  outPuts: Map<string | Symbol, [CfnOutput]>;
}
