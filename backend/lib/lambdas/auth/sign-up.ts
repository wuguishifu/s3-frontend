import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import bcrypt from 'bcryptjs';

const client = new DynamoDBClient({ region: process.env.REGION });
const USERS_TABLE = process.env.USERS_TABLE;
const DEV = process.env.STAGE === 'dev';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (DEV) console.log(event);

    const { email, password } = JSON.parse(event.body ?? '{}');
    if (!email || !password) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({
                error: 'email and password required'
            })
        };
        if (DEV) console.log(response);
        return response;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        await client.send(new PutItemCommand({
            TableName: USERS_TABLE,
            ConditionExpression: 'attribute_not_exists(id)',
            Item: {
                id: { S: email },
                password_hash: { S: hash }
            }
        }));

        const response = {
            statusCode: 200,
            body: JSON.stringify({ id: email, password_hash: hash })
        };
        if (DEV) console.log(response);
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                error: 'internal server error',
                message: error instanceof Error ? error.message : 'an unknown error has occurred'
            })
        };
        if (DEV) console.log(response);
        return response;
    }
};