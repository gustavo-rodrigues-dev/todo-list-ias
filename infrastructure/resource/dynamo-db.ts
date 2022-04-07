import { CfnOutput } from 'aws-cdk-lib';
import {
  Table,
  AttributeType,
  BillingMode,
  TableClass,
  TableEncryption,
} from 'aws-cdk-lib/aws-dynamodb';
import { ToDoDynamoDb } from './resources';
import { StackResource } from '../stack-resource';

export class DynamoDbStack {
  constructor(stack: StackResource) {
    const db = new Table(stack, 'TodoTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      encryption: TableEncryption.AWS_MANAGED,
    });
    stack.resources.set(ToDoDynamoDb, db);

    stack.outPuts.set(ToDoDynamoDb, [
      new CfnOutput(db, 'TodoTableNameExport', {
        value: db.tableName,
        exportName: 'tableName',
      }),
    ]);
  }
}
