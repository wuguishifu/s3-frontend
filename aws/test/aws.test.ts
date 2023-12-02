import { Template } from 'aws-cdk-lib/assertions';
import { App } from "aws-cdk-lib";
import { AwsStack } from "../lib/aws-stack";

test('IAM roles are created with correct assumptions', () => {
    const app = new App();
    const stack = new AwsStack(app, 'TestStack');
    const template = Template.fromStack(stack);

    // validate authenticated role is created with expected assumptions
    template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: {
                        Federated: 'cognito-identity.amazonaws.com'
                    },
                    Action: 'sts:AssumeRoleWithWebIdentity',
                    Condition: {
                        StringEquals: {
                            'cognito-identity.amazonaws.com:aud': {
                                'Fn::GetAtt': ['IdentityPool', 'Ref']
                            }
                        },
                        'ForAnyValue:StringLike': {
                            'cognito-identity.amazonaws.com:arm': 'authenticated'
                        }
                    }
                }
            ]
        }
    });

    // validate unauthenticated role is created with expected assumptions
    template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [
                {
                    Effect: 'Deny',
                    Principal: {
                        Federated: 'cognito-identity.amazonaws.com'
                    },
                    Action: 'sts:AssumeRoleWithWebIdentity',
                    Condition: {
                        StringEquals: {
                            'cognito-identity.amazonaws.com:aud': {
                                'Fn::GetAtt': ['IdentityPool', 'Ref']
                            }
                        },
                        'ForAnyValue:StringLike': {
                            'cognito-identity.amazonaws.com:arm': 'unauthenticated'
                        }
                    }
                }
            ]
        }
    });

});