import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Stack } from '../../infrastructure/stack';

describe('CdkBaseStack.constructor', () => {
  const app = new cdk.App();
  const stack = new Stack(app, 'MyTestStack');
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

  it('Should Lambda Api can ListBucket, GetObject and PutObject on Bucket', () => {
    const bucketName = Object.keys(
      template.findResources('AWS::S3::Bucket'),
    )[0];

    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectLike({
        Environment: {
          Variables: {
            BUCKET_NAME: {
              Ref: bucketName,
            },
          },
        },
      }),
    );

    template.hasResourceProperties(
      'AWS::IAM::Policy',
      Match.objectEquals({
        PolicyDocument: {
          Statement: [
            {
              Action: 'S3:ListBucket',
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('ToDoBucketStack\\S+'),
                  'Arn',
                ],
              },
            },
            {
              Action: ['S3:GetObject', 'S3:PutObject'],
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('ToDoBucketStack\\S+'),
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            },
          ],
          Version: '2012-10-17',
        },
        PolicyName: Match.stringLikeRegexp('ApiLambda\\S+'),
        Roles: [
          {
            Ref: Match.stringLikeRegexp('ApiLambda\\S+'),
          },
        ],
      }),
    );
  });

  it('Should stack contains ApiGateway for Lambda Api', () => {
    template.hasResource('AWS::ApiGateway::RestApi', {});
    template.hasResource(
      'AWS::ApiGateway::Method',
      Match.objectLike({
        Properties: {
          HttpMethod: 'ANY',
          ResourceId: {
            Ref: Match.stringLikeRegexp('ToDoApiproxy\\S+'),
          },
          RestApiId: {
            Ref: Match.stringLikeRegexp('ToDoApi\\S+'),
          },
          Integration: {
            IntegrationHttpMethod: 'POST',
            Type: 'AWS_PROXY',
            Uri: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':apigateway:',
                  {
                    Ref: 'AWS::Region',
                  },
                  Match.stringLikeRegexp(':lambda:path\\S+'),
                  {
                    'Fn::GetAtt': [
                      Match.stringLikeRegexp('ApiLambda\\S+'),
                      'Arn',
                    ],
                  },
                  '/invocations',
                ],
              ],
            },
          },
        },
      }),
    );
  });
});
