import { CfnOutput } from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { ToDoBucket } from './resources';
import { StackResource } from '../stack-resource';

export class S3BucketStack {
  constructor(stack: StackResource) {
    const bucket = new Bucket(stack, 'ToDoBucketStack', {
      encryption: BucketEncryption.S3_MANAGED,
    });
    stack.resources.set(ToDoBucket, bucket);

    stack.outPuts.set(ToDoBucket, [
      new CfnOutput(bucket, 'TodoBucketNameExport', {
        value: bucket.bucketName,
        exportName: 'bucketName',
      }),
    ]);
  }
}
