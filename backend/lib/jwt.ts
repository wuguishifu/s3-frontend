import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const privateKeyObject = crypto.createPrivateKey({
    key: process.env.PRIVATE_KEY!,
    format: 'pem',
    passphrase: 'hi william'
});

export async function generateJwt(email: string): Promise<string> {
    return new Promise<string>((resolve) => {
        jwt.sign({ email }, privateKeyObject, { algorithm: 'RS256' }, (error, token) => {
            if (error) throw error;
            if (!token) throw new Error('token not generated');
            resolve(token);
        });
    });
};

type Decoded = {
    email: string;
};

export function validateJwt(token: string): Promise<Decoded> {
    return new Promise<Decoded>((resolve) => {
        jwt.verify(token, process.env.PUBLIC_KEY!, { algorithms: ['RS256'] }, (error, decoded) => {
            if (error) throw error;
            resolve(decoded as Decoded);
        });
    });
};