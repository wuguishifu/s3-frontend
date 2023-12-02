import { Router } from "express";
import { JsonDB } from "node-json-db";

export default (db: JsonDB): Router => {
    const router = Router();

    router.get('/:provider/:type', async (req, res) => {
        const { provider, type } = req.params as { provider: string; type: string };

        const key = await db.getObjectDefault<string | null>(`/${provider}/${type}`, null);
        if (key != null) {
            return res.status(200).send({ key });
        } else {
            return res.status(404).send({ error: 'key not found' });
        }
    });

    router.post('/:provider/:type', async (req, res) => {
        const { provider, type } = req.params as { provider: string; type: string };
        const { value } = req.body as { value: string };

        try {
            void await db.push(`/${provider}/${type}`, value);
            return res.status(200).send({ message: 'key updated' });
        } catch (error) {
            let message = 'An unknown error occurred.';
            if (error instanceof Error) message = error.message;
            return res.status(500).send({ error: `could not set ${provider}.${type}`, message });
        }
    });

    router.delete('/:provider/:type', async (req, res) => {
        const { provider, type } = req.params as { provider: string; type: string };

        try {
            void await db.delete(`/${provider}/${type}`);
            return res.status(200).send({ message: 'key deleted' });
        } catch (error) {
            let message = 'An unknown error occurred.';
            if (error instanceof Error) message = error.message;
            return res.status(500).send({ error: `could not delete ${provider}.${type}`, message });
        }
    });

    return router;
};