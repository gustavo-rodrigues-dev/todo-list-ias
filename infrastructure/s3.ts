import { Stack, StackProps } from "aws-cdk-lib";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class S3BucketStack {
    readonly bucket: Bucket;
    constructor(stack: Stack){
        this.bucket = new Bucket(stack, 'to-do-bucket', {
            encryption: BucketEncryption.S3_MANAGED,
            bucketName: 'to-do-bucket'
        });
    }
}