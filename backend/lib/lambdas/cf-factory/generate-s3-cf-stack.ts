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
    if (process.env.STAGE === 'dev') console.log(event);

    if (!event.body) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({ error: 'Bad request.', message: 'Missing request body.' })
        };

        if (process.env.STAGE === 'dev') console.log(response);
        return response;
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
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                stack: synth.stacks[0].template
            })
        };
        if (process.env.STAGE === 'dev') console.log(response);
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error.',
                message: error instanceof Error ? error.message : 'An unknown error has occurred.'
            })
        };
        if (process.env.STAGE === 'dev') console.log(response);
        return response;
    }
};