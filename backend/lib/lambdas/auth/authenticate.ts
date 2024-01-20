import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import cookie from 'cookie';
import { generateJwt, validateJwt } from '@/utils/jwt';

const DEV = process.env.STAGE === 'dev';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (DEV) console.log(event);

    const cookies = event.headers.Cookie || '';
    const parsedCookies = cookie.parse(cookies);
    console.log({ cookies, parsedCookies });
    const token = parsedCookies.token;

    if (!token) {
        const response = {
            statusCode: 401,
            body: JSON.stringify({
                authenticated: false,
                error: 'unauthorized',
                message: 'missing token'
            })
        };
        if (DEV) console.log(response);
        return response;
    }

    let email;
    try {
        const decoded = await validateJwt(token);
        email = decoded.email;
    } catch (error) {
        const response = {
            statusCode: 401,
            body: JSON.stringify({
                authenticated: false,
                error: 'unauthorized',
                message: error instanceof Error ? error.message : 'an unknown error has occurred'
            })
        };
        if (DEV) console.log(response);
        return response;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            authenticated: true,
            id: email
        })
    };
    if (DEV) console.log(response);
    return response;
};