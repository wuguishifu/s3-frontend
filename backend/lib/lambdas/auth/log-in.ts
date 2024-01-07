import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import bcrypt from 'bcryptjs';
import { generateJwt } from '../../jwt';

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

    let user;
    try {
        const item = await client.send(new GetItemCommand({
            TableName: USERS_TABLE,
            Key: {
                id: { S: email }
            }
        }));
        user = item.Item;
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

    if (!user) {
        const response = {
            statusCode: 404,
            body: JSON.stringify({
                error: 'user not found'
            })
        };
        if (DEV) console.log(response);
        return response;
    }

    const passwordHash = user.password_hash.S;
    const passwordMatch = await bcrypt.compare(password, passwordHash ?? '');

    if (!passwordMatch) {
        const response = {
            statusCode: 401,
            body: JSON.stringify({
                error: 'invalid password'
            })
        };
        if (DEV) console.log(response);
        return response;
    }

    let token;
    try {
        token = await generateJwt(email);
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                error: 'internal server error',
                message: error instanceof Error ? error.message : 'an unknown error has occurred'
            })
        }
        if (DEV) console.log(response);
        return response;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({ token })
    };
    if (DEV) console.log(response);
    return response;
};