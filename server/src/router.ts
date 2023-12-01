import { Router } from "express";
import { JsonDB } from "node-json-db";
import settings from "./routes/settings";
import buckets from "./routes/buckets";
import AwsHelper from "./lib/AwsHelper";

export default (db: JsonDB, s3: AwsHelper): Router => {
    const router = Router();

    router.use('/settings', settings(db, s3));
    router.use('/buckets', buckets(s3));

    return router;
}