import { Stack, CfnOutput } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import path from "path";

export class ApiFunctionStack {
    readonly apiFunction: NodejsFunction;
    constructor(stack: Stack){
        console.log(path.join(__dirname, '..', 'api', 'index.ts'));
        this.apiFunction = new NodejsFunction(stack, 'ApiLambda', {
            runtime: Runtime.NODEJS_14_X,
            entry: path.join(__dirname, '..', 'api', 'src', 'index.ts'),
            handler: 'handleHello', 
            depsLockFilePath: path.join(__dirname, '..', 'api', 'package-lock.json'),
            

        });

       new CfnOutput(this.apiFunction, "ApiLambdaExport", {
          value: this.apiFunction.functionName,
          exportName: "FunctionName"
        });
    }
}