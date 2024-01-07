import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CFFactory } from './CFFactory';

type RequestBody = {
    access: 'general' | 'restricted';
    policies: {
        CreateBucket: boolean;
        DeleteBucket: boolean;
    };
    buckets: {
        bucketName: string;
        removalPolicy: 'DESTROY' | 'RETAIN' | 'SNAPSHOT';
    }[];
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'bad request', message: 'missing request body' })
        };
    }

    const body: RequestBody = JSON.parse(event.body);
    body.access ??= 'general';
    body.policies ??= {
        CreateBucket: false,
        DeleteBucket: false
    };
    body.buckets ??= [];

    try {
        const factory = new CFFactory(body);
        const synth = factory.synth();
        return {
            statusCode: 200,
            body: JSON.stringify({
                stack: synth.stacks[0].template
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'internal server error',
                message: error instanceof Error ? error.message : 'an unknown error has occurred'
            })
        };
    }
};