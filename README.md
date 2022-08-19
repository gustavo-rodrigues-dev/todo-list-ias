## Summary

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/92522ff9e91842688d38143368ac280d)](https://app.codacy.com/gh/gustavobeavis/todo-list-ias?utm_source=github.com&utm_medium=referral&utm_content=gustavobeavis/todo-list-ias&utm_campaign=Badge_Grade_Settings)

This project is structured in a mono-repository where it is possible to have an end-to-end view of the project, from the front-end to the infrastructure as code using CDK. In terms of technologies, I chose to make the most of AWS resources, especially Lambda, API Gateway, DynamoDB, and S3. Casually I may delve deeper, including SQS for some events.

## infrastructure

In this session, all the infrastructure code using CDK, where OO and precedence issues were used to build the Stack.
About the infrastructure, all the code can be seen from the `./infrastructure` folder. That all resources have unit testing to check permissions and precedence.

## API

In the API, I used NestJS to ease the application’s modularization and reduce the need to create non-functional codes with standardization.
In terms of architecture, I chose to use domain-oriented CQRS, as we can explore asynchronous event invocations that can react to task stream actions. The command part is free to be executed in an HTTP controller, event, or even a lambda handler.
As for the unit tests, I kept them nested in implementing modules and classes, so test contexts’ maintenance, coverage, and execution become more usual and visual.

### Disclaimers

#### *Why it use NestJS*

In the API, I used NestJS to ease the application’s modularization and reduce the need to create non-functional codes with standardization.

#### *Why wasn't it done using a standalone application*

I chose to run a full proxy inside the nest. It was just a simplification; I know in advance that in terms of performance and API design, it is more advisable to use a standalone application and directly call each function and have a handle per route. [Ref](https://docs.nestjs.com/faq/serverless)

## Useful commands

*   `npm run build` compile typescript to js
*   `npm run watch` watch for changes and compile
*   `npm run test` perform the jest unit tests
*   `cdk deploy` deploy this stack to your default AWS account/region
*   `cdk diff` compare deployed stack with current state
*   `cdk synth` emits the synthesized CloudFormation template
