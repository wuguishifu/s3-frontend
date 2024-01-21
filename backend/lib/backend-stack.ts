import * as cdk from 'aws-cdk-lib';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';

const STAGE = process.env.STAGE ?? 'dev';

export class BackendStack extends cdk.Stack {
    readonly api: apigatewayv2.HttpApi;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

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
    }
};