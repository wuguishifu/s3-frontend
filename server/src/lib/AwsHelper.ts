import { S3Client } from '@aws-sdk/client-s3';
import { JsonDB } from 'node-json-db';

export default class AwsHelper {
    public client: { [region: string]: S3Client | null } = {};
    private key: string | null = null;
    private secret: string | null = null;
    private defaultRegion: string;

    constructor(defaultRegion: string) {
        this.defaultRegion = defaultRegion;
        this.client = {
            default: null
        };
    }

    init = async (db: JsonDB): Promise<void> => {
        const { key, secret } = await db.getObjectDefault('/aws', { key: null, secret: null })
        this.key = key;
        this.secret = secret;

        this.client = {
            default: null,
            [this.defaultRegion]: null
        }

        if (!this.key || !this.secret) return;

        const defaultClient = new S3Client({
            region: this.defaultRegion,
            credentials: {
                accessKeyId: this.key,
                secretAccessKey: this.secret
            }
        });

        this.client = {
            default: defaultClient,
            [this.defaultRegion]: defaultClient
        }
    }

    public generate = (region: string): void => {
        if (this.key == null || this.secret == null) return;
        if (this.client[region] != null) return;
        this.client[region] = new S3Client({
            region,
            credentials: {
                accessKeyId: this.key,
                secretAccessKey: this.secret
            }
        });
    }

    public setKey = (key: string | null): void => {
        this.key = key;
        this.regenerate();
    };

    public setSecret = (secret: string | null): void => {
        this.secret = secret;
        this.regenerate();
    }

    private regenerate = (): void => {
        if (this.key != null && this.secret != null) {
            for (const region in this.client) {
                if (region === 'default') continue;
                const client = new S3Client({
                    region,
                    credentials: {
                        accessKeyId: this.key,
                        secretAccessKey: this.secret
                    }
                });
                this.client[region] = client;
                if (region === this.defaultRegion) this.client.default = client;
            }
        } else {
            this.client = {
                defualt: null,
                [this.defaultRegion]: null
            };
        }
    };
}