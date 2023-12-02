import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AwsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // create cognito user pool
        const userPool = new cognito.UserPool(this, 'UserPool', {
            userPoolName: 'user-pool',
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            },
            autoVerify: {
                email: true
            }
        });

        // create cognito app client
        const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
            userPool,
            authFlows: {
                userSrp: true,
                userPassword: true
            }
        });

        // output user pool and app client ids
        new cdk.CfnOutput(this, 'UserPoolId', {
            value: userPool.userPoolId
        });

        new cdk.CfnOutput(this, 'UserPoolClientId', {
            value: userPoolClient.userPoolClientId
        });

        // create cognito identity pool
        const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [{
                clientId: userPoolClient.userPoolClientId,
                providerName: userPool.userPoolProviderName
            }]
        });

        // define IAM roles for authenticated and unauthenticated users
        const authenticatedRole = new iam.Role(this, 'CognitoAuthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
                    'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
                },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        const unauthenticatedRole = new iam.Role(this, 'CognitoUnauthenticatedRole', {
            assumedBy: new iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: { 'cognito-identity.amazonaws.com:aud': identityPool.ref },
                    'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'unauthenticated' },
                },
                'sts:AssumeRoleWithWebIdentity'
            )
        });

        // attach allow full access to s3 policy
        authenticatedRole.attachInlinePolicy(new iam.Policy(this, 'AuthenticatedPolicy', {
            document: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ['s3:*'],
                        resources: ['*']
                    })
                ]
            })
        }));

        // attach disallow all access to s3 policy
        unauthenticatedRole.attachInlinePolicy(new iam.Policy(this, 'UnauthenticatedPolicy', {
            document: new iam.PolicyDocument({
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.DENY,
                        actions: ['s3:*'],
                        resources: ['*']
                    })
                ]
            })
        }));

        // attach roles to cognito identity pool
        new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoles', {
            identityPoolId: identityPool.ref,
            roles: {
                authenticated: authenticatedRole.roleArn,
                unauthenticated: unauthenticatedRole.roleArn
            }
        });
    }
}