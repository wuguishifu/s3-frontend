import dotenv from 'dotenv';
import * as cdk from 'aws-cdk-lib';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

const STAGE = process.env.STAGE ?? 'dev';

export class BackendStack extends cdk.Stack {
    readonly api: apigatewayv2.HttpApi;
    readonly usersTable: dynamodb.Table;

    readonly signupLambda: lambdaNodejs.NodejsFunction;
    readonly loginLambda: lambdaNodejs.NodejsFunction;
    readonly authenticationLambda: lambdaNodejs.NodejsFunction;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        dotenv.config();
        if (!process.env.PRIVATE_KEY) throw new Error('missing private key');
        if (!process.env.PUBLIC_KEY) throw new Error('missing public key');
        const PRIVATE_KEY_PASSPHRASE = process.env.PRIVATE_KEY_PASSPHRASE!;

        // api
        this.api = new apigatewayv2.HttpApi(this, `BucketStoreApi-${STAGE}`, {
            apiName: `BucketStoreApi-${STAGE}`,
            corsPreflight: {
                allowHeaders: [
                    'Content-Type'
                ],
                allowMethods: [
                    apigatewayv2.CorsHttpMethod.POST,
                    apigatewayv2.CorsHttpMethod.OPTIONS
                ],
                allowOrigins: [
                    'http://localhost:3000',
                    'http://localhost:5173'
                ],
                allowCredentials: true
            }
        });

        // lampda function to generate s3 cloudformation stack
        this.api.addRoutes({
            path: '/generate-s3-cf-stack',
            methods: [apigatewayv2.HttpMethod.POST],
            integration: new integrations.HttpLambdaIntegration(
                `BucketStoreGenerateS3CFStackLambdaIntegration-${STAGE}`,
                new lambdaNodejs.NodejsFunction(this, `BucketStoreGenerateS3CFStackLambda-${STAGE}`, {
                    entry: `${__dirname}/lambdas/cf-factory/generate-s3-cf-stack.ts`,
                    handler: 'handler',
                    runtime: lambda.Runtime.NODEJS_18_X,
                    environment: {
                        REGION: this.region
                    }
                })
            )
        });

        // auth table
        this.usersTable = new dynamodb.Table(this, `UserTable-${STAGE}`, {
            tableName: `BucketStoreUsers-${STAGE}`,
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            removalPolicy: STAGE === 'dev' ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN
        });

        this.signupLambda = new lambdaNodejs.NodejsFunction(this, `BucketStoreSignUpLambda-${STAGE}`, {
            entry: `${__dirname}/lambdas/auth/sign-up.ts`,
            handler: 'handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                REGION: this.region,
                USERS_TABLE: this.usersTable.tableName,
                STAGE: STAGE,
                PRIVATE_KEY: atob(process.env.PRIVATE_KEY!),
                PUBLIC_KEY: atob(process.env.PUBLIC_KEY!),
                PRIVATE_KEY_PASSPHRASE
            }
        });

        this.loginLambda = new lambdaNodejs.NodejsFunction(this, `BucketStoreLoginLambda-${STAGE}`, {
            entry: `${__dirname}/lambdas/auth/log-in.ts`,
            handler: 'handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                REGION: this.region,
                USERS_TABLE: this.usersTable.tableName,
                STAGE: STAGE,
                PRIVATE_KEY: atob(process.env.PRIVATE_KEY!),
                PUBLIC_KEY: atob(process.env.PUBLIC_KEY!),
                PRIVATE_KEY_PASSPHRASE
            }
        });

        this.authenticationLambda = new lambdaNodejs.NodejsFunction(this, `BucketStoreAuthenticationLambda-${STAGE}`, {
            entry: `${__dirname}/lambdas/auth/authenticate.ts`,
            handler: 'handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                REGION: this.region,
                STAGE: STAGE,
                PRIVATE_KEY: atob(process.env.PRIVATE_KEY!),
                PUBLIC_KEY: atob(process.env.PUBLIC_KEY!),
                PRIVATE_KEY_PASSPHRASE
            }
        });

        this.usersTable.grantWriteData(this.signupLambda);
        this.usersTable.grantReadData(this.loginLambda);

        this.api.addRoutes({
            path: '/auth/sign-up',
            methods: [apigatewayv2.HttpMethod.POST],
            integration: new integrations.HttpLambdaIntegration(
                `BucketStoreSignUpLambda-${STAGE}`,
                this.signupLambda
            )
        });

        this.api.addRoutes({
            path: '/auth/log-in',
            methods: [apigatewayv2.HttpMethod.POST],
            integration: new integrations.HttpLambdaIntegration(
                `BucketStoreLoginLambda-${STAGE}`,
                this.loginLambda
            )
        });

        this.api.addRoutes({
            path: '/auth/authenticate',
            methods: [apigatewayv2.HttpMethod.GET],
            integration: new integrations.HttpLambdaIntegration(
                `BucketStoreAuthenticationLambda-${STAGE}`,
                this.authenticationLambda
            ),
        });
    }
};