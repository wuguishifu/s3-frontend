import express from 'express';
import http from 'http';
import cors from 'cors';
import './keystore.json';

import provider from './provider';

import { Config, JsonDB } from 'node-json-db';

const keystore = new JsonDB(new Config('./dist/keystore.json', true, false, '/'));

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '1mb' }));

app.get('/ping', async (_, res) => {
    res.send({
        message: 'pong',
        time: new Date().toLocaleString()
    });
});

app.use('/keystore', provider(keystore));

const port = process.env.PORT ?? 8080;
server.listen(port, () => console.log('keystore server running on port', +port));

if (process.platform === 'win32') {
    const wInterface = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    wInterface.on('SIGINT', () => {
        process.exit(0);
    });
}

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('SIGTERM', () => {
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    console.error(err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(1);
});