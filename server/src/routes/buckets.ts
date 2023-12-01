import { Router } from "express";
import AwsHelper from "~/lib/AwsHelper";

import { CreateBucketCommand, DeleteBucketCommand, DeleteObjectsCommand, GetBucketLocationCommand, ListBucketsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketLocationCache: { [name: string]: { region: string } } = {};

export default (s3: AwsHelper): Router => {
    const router = Router();

    // uses the default client for fetching buckets and their regions,
    // then generates regional clients for each bucket
    router.get('/', async (_, res) => {
        if (!s3.client.default) return res.status(500).send({ message: 's3 not initialized properly' });

        let buckets;
        try {
            buckets = (await s3.client.default.send(new ListBucketsCommand({}))).Buckets;
        } catch (error) {
            const message = error instanceof Error ? error.message : error;
            return res.status(500).send({ error: 'could not fetch buckets', message });
        }

        if (!buckets) return res.status(200).send({ buckets: [] });

        (await Promise.allSettled(buckets.map(async b => {
            const location = await s3.client.default!.send(new GetBucketLocationCommand({ Bucket: b.Name }));
            if (!location?.LocationConstraint) return { region: 'us-east-1' };
            return { name: b.Name, region: location.LocationConstraint };
        }))).forEach((p) => {
            if (p.status === 'fulfilled') {
                p.value.name && (bucketLocationCache[p.value.name] = { region: p.value.region });
            }
        })

        res.status(200).send({
            buckets: buckets.map(b => ({
                name: b.Name,
                created_at: b.CreationDate,
                region: bucketLocationCache[b.Name ?? '']?.region ?? 'us-east-1'
            }))
        });

        // generate regional clients
        for (const bucket in bucketLocationCache) {
            const region = bucketLocationCache[bucket].region;
            s3.generate(region);
        }
    });

    router.post('/', async (req, res) => {
        const { region, name } = req.body as { region: string, name: string };
        if (!region) return res.status(400).send({ message: 'region is required' });
        if (!name) return res.status(400).send({ message: 'name is required' });

        s3.generate(region);
        if (!s3.client[region]) return res.status(500).send({ message: 's3 not initialized properly' });

        try {
            void await s3.client[region]!.send(new CreateBucketCommand({ Bucket: name }));
        } catch (error) {
            const message = error instanceof Error ? error.message : error;
            return res.status(500).send({ error: 'could not create bucket', message });
        }

        res.status(201).send({
            name,
            created_at: new Date(),
            region
        });
    });

    router.delete('/', async (req, res) => {
        const { name } = req.query as { name: string };
        if (!name) return res.status(400).send({ message: 'name is required', deleted: false });

        const region = bucketLocationCache[name]?.region ?? 'us-east-1';
        if (!s3.client[region]) return res.status(500).send({ message: 's3 not initialized properly', deleted: false });

        let objectListing;
        try {
            objectListing = await s3.client[region]!.send(new ListObjectsV2Command({ Bucket: name }));
        } catch (error) {
            const message = error instanceof Error ? error.message : error;
            return res.status(500).send({ error: 'could not list objects', message, deleted: false });
        }

        if (objectListing.Contents?.length) {
            while (objectListing.Contents?.length) {
                try {
                    await s3.client[region]!.send(new DeleteObjectsCommand({
                        Bucket: name,
                        Delete: { Objects: objectListing.Contents.map(c => ({ Key: c.Key })) }
                    }));
                } catch (error) {
                    const message = error instanceof Error ? error.message : error;
                    return res.status(500).send({ error: 'could not delete objects', message, deleted: false });
                }

                if (!objectListing.IsTruncated) break;

                try {
                    objectListing = await s3.client[region]!.send(new ListObjectsV2Command({
                        Bucket: name,
                        ContinuationToken: objectListing.NextContinuationToken
                    }));
                } catch (error) {
                    const message = error instanceof Error ? error.message : error;
                    return res.status(500).send({ error: 'could not list objects', message, deleted: false });
                }
            }
        }

        try {
            void await s3.client[region]!.send(new DeleteBucketCommand({ Bucket: name }));
        } catch (error) {
            const message = error instanceof Error ? error.message : error;
            return res.status(500).send({ error: 'could not delete bucket', message, deleted: false });
        }

        res.status(200).send({ deleted: true });
        delete bucketLocationCache[name];
    });

    router.get('/documents', async (req, res) => {
        const { bucket, continuationToken } = req.query as { bucket: string, continuationToken?: string };

        if (!bucket) return res.status(400).send({ message: 'bucket is required' });
        const region = bucketLocationCache[bucket]?.region ?? 'us-east-1';

        if (!s3.client[region]) return res.status(500).send({ message: 's3 not initialized properly' });

        let contents, nextContinuationToken;
        try {
            const response = await s3.client[region]!.send(new ListObjectsV2Command({
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

        const region = bucketLocationCache[bucket]?.region ?? 'us-east-1';

        if (!s3.client[region]) return res.status(500).send({ message: 's3 not initialized properly' });

        let url;
        try {
            url = await getSignedUrl(
                s3.client[region]!,
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

        const region = bucketLocationCache[bucket]?.region ?? 'us-east-1';

        if (!s3.client[region]) return res.status(500).send({ message: 's3 not initialized properly' });
        try {
            void await s3.client[region]!.send(new DeleteObjectsCommand({
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