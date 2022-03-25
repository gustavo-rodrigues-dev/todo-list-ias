import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CdkBaseStack from '../../infrastructure/infrastructure';
// example test. To run these tests, uncomment this file along with the
// example resource in lib/cdk-base-stack.ts

describe('CdkBaseStack.constructor', () => {
    const app = new cdk.App();
    const stack = new CdkBaseStack.CdkBaseStack(app, 'MyTestStack');
    const template = Template.fromStack(stack);

    it('Should create a stack with tag project: to-do-stack', () => {
        expect(stack.tags.tagValues()).toEqual({ project: 'to-do-stack' });
    });

    it('Should stack contains S3 bucket', () => {
        const s3Resources = template.findResources('AWS::S3::Bucket');
        const s3Keys = Object.keys(s3Resources);

        template.hasOutput('ToDoBucketStackTodoBucketNameExport81992C41', {
          Value: {
            Ref: s3Keys[0],
          },
          Export: {
            Name: 'bucketName',
          },
        });

        template.hasResource('AWS::S3::Bucket', {
            Type: 'AWS::S3::Bucket',
            Properties: {
              BucketEncryption: {
                ServerSideEncryptionConfiguration: [
                  {
                    ServerSideEncryptionByDefault: {
                      SSEAlgorithm: 'AES256',
                    },
                  },
                ],
              },
              Tags: [
                {
                  Key: 'project',
                  Value: 'to-do-stack',
                },
              ],
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain',
          });
    });

    it('Should stack contains Lambda Api', () => {
      template.hasResource('AWS::Lambda::Function', {});
    });

    it('Should stack contains ApiGateway for Lambda Api', () => {
      template.hasResource('AWS::ApiGateway::RestApi', {});
    });
});
