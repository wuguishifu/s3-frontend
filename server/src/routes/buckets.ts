import { Router } from "express";
import { JsonDB } from "node-json-db";
import AwsHelper from "~/lib/AwsHelper";

import { ListBucketsCommand } from '@aws-sdk/client-s3';

export default (db: JsonDB, s3: AwsHelper): Router => {
    const router = Router();

    router.get('/buckets', async (_, res) => {
        if (!s3.client) return res.status(500).send({ message: 's3 not initialized' });
        const buckets = await s3.client!.send(new ListBucketsCommand({}));
        res.send(buckets);
    });

    return router;
};