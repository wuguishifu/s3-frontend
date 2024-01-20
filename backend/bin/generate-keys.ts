import { generateKeyPair } from "crypto";
import fs from 'fs';

const PRIVATE_KEY_PASSPHRASE = 'hi william';

(async () => {
    const { publicKey, privateKey } = await new Promise<{
        publicKey: string;
        privateKey: string;
    }>(resolve => {
        generateKeyPair('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: PRIVATE_KEY_PASSPHRASE
            }
        }, (error, publicKey, privateKey) => {
            if (error) throw error;
            resolve({ publicKey, privateKey });
        })
    });

    const envOut = [
        `PRIVATE_KEY="${Buffer.from(privateKey).toString('base64')}"`,
        `PUBLIC_KEY="${Buffer.from(publicKey).toString('base64')}"`,
        `PRIVATE_KEY_PASSPHRASE="${PRIVATE_KEY_PASSPHRASE}"`
    ].join('\n');

    fs.writeFileSync(`${__dirname}/../keys/public.pem`, publicKey);
    fs.writeFileSync(`${__dirname}/../keys/private.pem`, privateKey);
    fs.writeFileSync(`${__dirname}/../.env`, envOut);
})()
    .then(() => process.exit(0))
    .catch(console.error);