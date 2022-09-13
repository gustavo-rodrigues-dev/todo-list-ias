import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { StackResource } from '../stack-resource';
import { TodoVpc } from './resources';

export class VpcStack {
  constructor(stack: StackResource) {
    const vpc = new Vpc(stack, 'TodoApplicationVPC');
    stack.resources.set(TodoVpc, vpc);
  }
}
