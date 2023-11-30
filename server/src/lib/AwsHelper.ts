import { S3Client } from '@aws-sdk/client-s3';
import { JsonDB } from 'node-json-db';

export default class AwsHelper {
    private s3Client: S3Client | null;

    constructor() {
        this.s3Client = null;
    }

    init = async (db: JsonDB) => {
        const data = await db.getObjectDefault<{ region: null | string, key: null | string, secret: null | string }>
            ('/aws', { region: null, key: null, secret: null });
        const { region, key, secret } = data;
        if (!region || !key || !secret) return;

        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId: key,
                secretAccessKey: secret
            }
        });
    }

    s3 = () => this.s3Client;
}