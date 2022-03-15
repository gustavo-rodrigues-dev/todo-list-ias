import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
 import * as CdkBaseStack from '../../infrastructure/infrastructure';
// example test. To run these tests, uncomment this file along with the
// example resource in lib/cdk-base-stack.ts
test('Should create a stack with tag project: to-do-stack', () => {
    const app = new cdk.App();
    const stack = new CdkBaseStack.CdkBaseStack(app, 'MyTestStack');
    expect(stack.tags.tagValues()).toEqual({ project: 'to-do-stack' })
});
