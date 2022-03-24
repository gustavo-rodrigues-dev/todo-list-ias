import { Stack, CfnOutput } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import path from "path";

export class ApiFunctionStack {
    readonly apiFunction: NodejsFunction;
    readonly apiGateway: LambdaRestApi;
    constructor(stack: Stack){
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

        this.apiGateway = new LambdaRestApi(stack, 'ToDoApi', {
            handler: this.apiFunction,
            proxy: true
        });

        new CfnOutput(this.apiGateway, "ApiGatewayExport", {
            value: this.apiGateway.restApiName,
            exportName: "RestApiName"
        });
    }
}