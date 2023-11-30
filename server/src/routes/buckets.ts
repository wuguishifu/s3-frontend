import { Router } from "express";
import { JsonDB } from "node-json-db";
import AwsHelper from "~/lib/AwsHelper";

import { DeleteObjectsCommand, GetBucketWebsiteCommand, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default (db: JsonDB, s3: AwsHelper): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        if (!s3.client) return res.status(500).send({ message: 's3 not initialized properly' });

        let buckets;
        try {
            buckets = (await s3.client.send(new ListBucketsCommand({}))).Buckets;
        } catch (error) {
            const message = error instanceof Error ? error.message : error;
            return res.status(500).send({ error: 'could not fetch buckets', message });
        }

        return res.status(200).send({
            buckets: buckets?.map(b => ({
                name: b.Name,
                created_at: b.CreationDate,
            })) || []
        });
    });

    router.get('/documents', async (req, res) => {
        const { bucket, "continuation-token": continuationToken } = req.query as
            { bucket: string, "continuation-token": string | undefined };

        if (!bucket) return res.status(400).send({ message: 'bucket is required' });
        if (!s3.client) return res.status(500).send({ message: 's3 not initialized properly' });

        let contents, nextContinuationToken;
        try {
            const response = await s3.client.send(new ListObjectsV2Command({
                Bucket: bucket,
                MaxKeys: 20,
                ContinuationToken: continuationToken
            }));
            contents = response.Contents;
            nextContinuationToken = response.NextContinuationToken;
        } catch (error) {
            return res.status(500).send({ error });
        }

        return res.status(200).send({
            documents: contents?.map(c => ({
                name: c.Key,
                last_modified: c.LastModified,
                size: c.Size
            })) || [],
            "continuation-token": nextContinuationToken
        });
    });

    router.get('/upload-url', async (req, res) => {
        const { bucket, filename } = req.query as { bucket: string; filename: string };

        if (!bucket) return res.status(400).send({ message: 'bucket is required' });
        if (!filename) return res.status(400).send({ message: 'filename is required' });

        if (!s3.client) return res.status(500).send({ message: 's3 not initialized properly' });

        let url;
        try {
            url = await getSignedUrl(
                s3.client,
                new PutObjectCommand({ Bucket: bucket, Key: filename }),
                { expiresIn: 3600 }
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : error;
            return res.status(500).send({ error: 'could not generate url', message });
        }

        return res.status(200).send({ url });
    });

    // example query array: ?bucket=Bucket&filenames[]=a&filenames[]=b
    router.delete('/documents', async (req, res) => {
        const { filenames, bucket } = req.query as { filenames: string[], bucket: string };
        if (!filenames) return res.status(200).send({ deleted: true, count: 0, failed: 0 });
        if (!s3.client) return res.status(500).send({ message: 's3 not initialized properly' });
        try {
            void await s3.client.send(new DeleteObjectsCommand({
                Bucket: bucket,
                Delete: { Objects: filenames.map(f => ({ Key: f })) }
            }));
        } catch (error) {
            return res.status(500).send({ error });
        }
        return res.status(200).send({ deleted: true, count: filenames.length, failed: 0 });
    });

    return router;
};