import { S3Client } from '@aws-sdk/client-s3';
import { JsonDB } from 'node-json-db';

export default class AwsHelper {
    public client: S3Client | null;

    constructor() {
        this.client = null;
    }

    init = async (db: JsonDB) => {
        const data = await db.getObjectDefault<{ region: null | string, key: null | string, secret: null | string }>
            ('/aws', { region: null, key: null, secret: null });
        const { region, key, secret } = data;
        if (!region || !key || !secret) return;

        this.client = new S3Client({
            region,
            credentials: {
                accessKeyId: key,
                secretAccessKey: secret
            }
        });
    }
}