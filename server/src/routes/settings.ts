import { Router } from "express";
import { JsonDB } from "node-json-db";
import AwsHelper from "~/lib/AwsHelper";

// purposefully no get methods for aws key and secret

export default (db: JsonDB, s3: AwsHelper): Router => {
    const router = Router();

    router.get('/', async (_, res) => {
        res.send(await db.getData('/'));
    });

    router.post('/aws/key', async (req, res) => {
        const { key } = req.body as { key: string };
        if (!key) return res.status(400).send({ message: 'key missing from body' });

        try {
            await db.push('/aws/key', key);
        } catch (error) {
            let message = 'unknown error';
            if (error instanceof Error) message = error.message;
            return res.status(500).send({ error: 'could not save key', message });
        }

        s3.setKey(key);
        res.status(201).send({ key });
    });

    router.post('/aws/secret', async (req, res) => {
        const { secret } = req.body as { secret: string };
        if (!secret) return res.status(400).send({ message: 'secret missing from body' });

        try {
            await db.push('/aws/secret', secret);
        } catch (error) {
            let message = 'unknown error';
            if (error instanceof Error) message = error.message;
            return res.status(500).send({ error: 'could not save secret', message });
        }

        s3.setSecret(secret);
        res.status(201).send({ secret });
    });

    router.post('/aws/region', async (req, res) => {
        const { region } = req.body as { region: string };
        if (!region) return res.status(400).send({ message: 'region missing from body' });

        try {
            await db.push('/aws/region', region);
        } catch (error) {
            let message = 'unknown error';
            if (error instanceof Error) message = error.message;
            return res.status(500).send({ error: 'could not save region', message });
        }

        res.status(201).send({ region });
    });

    router.get('/aws/region', async (req, res) => {
        let region;
        try {
            region = await db.getObjectDefault<null | string>('/aws/region', null);
        } catch (error) {
            let message = 'unknown error';
            if (error instanceof Error) message = error.message;
            return res.status(500).send({ error: 'could not get value', message });
        }

        return res.status(200).send({ region });
    });

    return router;
};