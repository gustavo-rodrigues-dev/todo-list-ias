/* eslint-disable no-magic-numbers */
import { Duration, CfnResource, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import {
  ApplicationLoadBalancer,
  ListenerAction,
  ListenerCondition,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { SecurityGroup, Port } from 'aws-cdk-lib/aws-ec2';
import {
  Cluster,
  ContainerImage,
  FargateService,
  FargateTaskDefinition,
  AwsLogDriver,
} from 'aws-cdk-lib/aws-ecs';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { PrivateDnsNamespace } from 'aws-cdk-lib/aws-servicediscovery';
import { StackResource } from '../stack-resource';
import { TodoVpc, TodoEcsCluster } from './resources';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import path from 'path';

export class ApiUserFargate {
  constructor(stack: StackResource) {
    const vpc = stack.resources.get(TodoVpc) as Vpc;
    const DEFAULT_PORT = 80;

    if (!vpc) {
      throw new Error('VPC not found');
    }

    const cluster = new Cluster(stack, 'TodoCluster', {
      vpc,
    });

    stack.resources.set(TodoEcsCluster, cluster);

    const dnsNamespace = new PrivateDnsNamespace(
      stack,
      'DnsTodoApiUserNamespace',
      {
        name: 'api-user.local',
        vpc,
        description: 'Private DnsNamespace for Api User',
      },
    );
    // Task Role
    const taskRole = new Role(stack, 'ecsTaskExecutionRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    taskRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AmazonECSTaskExecutionRolePolicy',
      ),
    );

    // Task Definitions
    const apiUserTaskDefinition = new FargateTaskDefinition(
      stack,
      'apiUserTaskDef',
      {
        memoryLimitMiB: 512,
        cpu: 256,
        taskRole,
      },
    );

    // Log
    const apiUserLogGroup = new LogGroup(stack, 'apiUserLogGroup', {
      logGroupName: '/ecs/ApiUser',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const apiUserLogDriver = new AwsLogDriver({
      logGroup: apiUserLogGroup,
      streamPrefix: 'ApiUser',
    });

    // Task Containers
    const apiUserContainer = apiUserTaskDefinition.addContainer(
      'UserContainer',
      {
        image: ContainerImage.fromAsset(
          path.join(__dirname, '..', '..', '..', 'user'),
        ),
        logging: apiUserLogDriver,
      },
    );
    apiUserContainer.addPortMappings({
      containerPort: DEFAULT_PORT,
    });

    // Security Groups
    const apiUserSecGrp = new SecurityGroup(stack, 'apiUserSecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'apiUserSecurityGroup',
      vpc,
    });

    apiUserSecGrp.connections.allowFromAnyIpv4(Port.tcp(DEFAULT_PORT));

    // Fargate Services
    const apiUserService = new FargateService(stack, 'apiUserService', {
      cluster,
      taskDefinition: apiUserTaskDefinition,
      assignPublicIp: false,
      desiredCount: 2,
      securityGroups: [apiUserSecGrp],
      cloudMapOptions: {
        name: 'apiUserService',
        cloudMapNamespace: dnsNamespace,
      },
    });

    // ALB
    const httpApiIExternalALB = new ApplicationLoadBalancer(
      stack,
      'httpapiUserInternalALB',
      {
        vpc,
        internetFacing: true,
      },
    );

    // ALB Listener
    const httpApiListener = httpApiIExternalALB.addListener('httpapiListener', {
      port: 80,
      // Default Target Group
      // eslint-disable-next-line no-magic-numbers
      defaultAction: ListenerAction.fixedResponse(200),
    });

    // Target Groups
    httpApiListener.addTargets('apiUserTargetGroup', {
      port: 80,
      priority: 1,
      healthCheck: {
        path: '/health',
        interval: Duration.seconds(30),
        timeout: Duration.seconds(3),
      },
      targets: [apiUserService],
      conditions: [ListenerCondition.pathPatterns(['/*'])],
    });

    // VPC Link
    new CfnResource(stack, 'HttpVpcLink', {
      type: 'AWS::ApiGatewayV2::VpcLink',
      properties: {
        Name: 'http-api-vpclink',
        SubnetIds: vpc.privateSubnets.map(m => m.subnetId),
      },
    });

    stack.outPuts.set(TodoEcsCluster, [
      new CfnOutput(httpApiListener, 'ApplicationLoadBalancerExport', {
        value: httpApiListener.loadBalancer.loadBalancerDnsName,
        exportName: 'loadBalancerDnsName',
      }),
    ]);
  }
}
