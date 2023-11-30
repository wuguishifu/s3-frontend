import express from "express";
import http from "http";
import minimist from "minimist";
import config from "./config.json";
import Router from "./router";

import './db.json';

import { Config, JsonDB } from "node-json-db";
import AwsHelper from "./lib/AwsHelper";

const args = minimist(process.argv.slice(2));

const s3 = new AwsHelper();
const db = new JsonDB(new Config('./dist/db.json', true, true, '/'));
s3.init(db);

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '48mb' }));

app.get('/ping', async (_, res) => {
    res.send({
        message: 'pong',
        time: new Date().toLocaleString()
    });
});

app.use('/api', Router(db, s3));

// WARN this should be read only so we probably don't need to go through the db
const port = config.port ?? 8080;

server.listen(port, () => {
    console.log('server running on port', +port);
});

let winInterface;
if (process.platform === 'win32') {
    winInterface = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    winInterface.on('SIGINT', () => {
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