import { Stack, CfnOutput } from "aws-cdk-lib";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";

export class S3BucketStack {
    readonly bucket: Bucket;
    constructor(stack: Stack){
        this.bucket = new Bucket(stack, 'to-do-bucket', {
            encryption: BucketEncryption.S3_MANAGED,
            bucketName: 'to-do-bucket'
        });

       new CfnOutput(this.bucket, "TodoBucketNameExport", {
          value: this.bucket.bucketName,
          exportName: "bucketName"
        });
    }
}