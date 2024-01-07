import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

type Bucket = { bucketName: string, removalPolicy: 'DESTROY' | 'RETAIN' | 'SNAPSHOT' };
type SchemaProps = {
    access: 'general' | 'restricted';
    policies: {
        CreateBucket: boolean;
        DeleteBucket: boolean;
    };
    buckets: Bucket[];
};
type CFSchemaProps = cdk.StackProps & SchemaProps;

export class CFFactory {
    private app: cdk.App;

    constructor(props: SchemaProps) {
        this.app = new cdk.App();
        new CFSchema(this.app, 'CFSchema', props);
    }

    public synth() {
        return this.app.synth();
    }
};

export class CFSchema extends cdk.Stack {
    private buckets: s3.Bucket[] | null = null;

    constructor(scope: Construct, id: string, props: CFSchemaProps) {
        super(scope, id, props);
        const { policies, buckets } = props;

        // create buckets if required
        if (buckets.length) {
            this.buckets = buckets.map(({ bucketName, removalPolicy }) => new s3.Bucket(this, bucketName, {
                bucketName,
                removalPolicy: cdk.RemovalPolicy[removalPolicy]
            }));
        }

        // create policy statement
        const policy = new iam.PolicyStatement({
            actions: [
                's3:ListBucket',
                's3:GetObject',
                's3:PutObject',
                's3:DeleteObject',
                's3:ListAllMyBuckets',
                's3:GetBucketWebsite',
                ...(policies.CreateBucket ? ['s3:CreateBucket'] : []),
                ...(policies.DeleteBucket ? ['s3:DeleteBucket'] : [])
            ],
            resources: !!this.buckets
                ? this.buckets?.flatMap(b => [b.bucketArn, `${b.bucketArn}/*`])
                : ['*'],
            effect: iam.Effect.ALLOW
        });

        // create iam user
        const user = new iam.User(this, 'BucketStoreUser');
        user.addToPolicy(policy);

        // create the access keys
        const accessKey = new iam.AccessKey(this, 'BucketStoreAccessKey', { user });
        const secretKey = new secretsmanager.Secret(this, 'BucketStoreSecretKey', {
            secretStringValue: accessKey.secretAccessKey
        });

        // create the outputs
        new cdk.CfnOutput(this, 'BucketStoreAccessKeyId', { value: accessKey.accessKeyId });
        new cdk.CfnOutput(this, 'BucketStoreSecretAccessKey', { value: secretKey.secretValue.toString() });
    }
};