/**
 * Vercel serverless entrypoint — catch-all for /api/* requests.
 * Boots Nest once per cold start, then hands requests to the Express instance.
 *
 * Deploy expectations (set as Vercel env vars):
 *   QUEUES_ENABLED=false REALTIME_ENABLED=false LOG_DIR=/tmp PGSSL=true ...
 */
import 'reflect-metadata';
import express from 'express';
import { createNestApp } from '../src/app-bootstrap';

const server = express();
let appInit: Promise<unknown> | null = null;

export default async function handler(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  if (!appInit) {
    appInit = (async () => {
      const app = await createNestApp(server);
      await app.init();
    })();
  }
  await appInit;
  server(req, res);
}
