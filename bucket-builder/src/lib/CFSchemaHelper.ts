import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export default class CFSchemaHelper {
    private app: cdk.App;

    constructor(props: SchemaProps) {
        this.app = new cdk.App();
        new CFSchema(this.app, 'CFSchema', props);
    }

    public synthesize() {
        return this.app.synth();
    }
};

type SchemaProps = GeneralAccess | RestrictedAccess;

type IAMActions = {
    ListBucket: true;
    GetObject: true;
    PutObject: true;
    DeleteObject: true;
    ListAllMyBuckets: true;
    GetBucketWebsite: true;
};

type GeneralAccess = {
    access: 'general';
    policies: IAMActions & {
        CreateBucket: boolean;
        DeleteBucket: boolean;
    }
    buckets: {
        bucketName: string;
        removalPolicy: cdk.RemovalPolicy;
    }[];
};

type RestrictedAccess = {
    access: 'restricted';
    policies: IAMActions & {
        CreateBucket: false;
        DeleteBucket: false;
    };
    buckets: {
        bucketName: string;
        removalPolicy: cdk.RemovalPolicy;
    }[];
};

type CFSchemaProps = cdk.StackProps & SchemaProps;

export class CFSchema extends cdk.Stack {
    private buckets: s3.Bucket[] | null;

    constructor(scope: Construct, id: string, props: CFSchemaProps) {
        super(scope, id, props);
        const { access, buckets, policies } = props;

        // create buckets if required
        if (buckets?.length) {
            this.buckets = buckets.map(b => new s3.Bucket(this, b.bucketName, b));
        } else {
            this.buckets = null;
        }

        // create policy statement
        const policy = new iam.PolicyStatement({
            actions: Object.entries(policies).filter(([_, v]) => v).map(([v]) => `s3:${v}`),
            resources: access === 'restricted' ? [
                ...this.buckets!.map(b => b.bucketArn),
                ...this.buckets!.map(b => `${b.bucketArn}/*`)
            ] : ['*'],
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
}