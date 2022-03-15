import { Stack, StackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3BucketStack } from './s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkBaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    Tags.of(scope).add('project', 'to-do-stack');

    const bucket = (new S3BucketStack(this)).bucket;

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkCourseQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
