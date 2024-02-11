import 'dotenv';
import express from 'express';
import {createServer} from 'http';
import * as WebSocket from 'ws';
import Redis from 'ioredis';
import {join} from 'path';
import {createConnection} from 'mysql';

const app = express();
const server = createServer();
const wss = new WebSocket.WebSocketServer({ server });
const redis = new Redis('/var/run/redis/redis-server.sock');

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 8000;

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    redis.publish('channel', message);
  });

  const redisSubscriber = new Redis();
  redisSubscriber.subscribe('channel');
  redisSubscriber.on('message', (channel, message) => {
    ws.send(message);
  });

  ws.on('close', () => {
    redisSubscriber.unsubscribe('channel');
    redisSubscriber.quit();
  });
});

const htmlPath = join(__dirname, 'index.html');

app.use('/', express.static(__dirname/*path.join(__dirname, 'user')*/, {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));


app.get('/', (req, res) => {
  res.sendFile(htmlPath);
});

app.listen(PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', `Server listening on port ${PORT}`);
});

const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

db.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log('\x1b[32m%s\x1b[0m', 'Database Connected!');
});
