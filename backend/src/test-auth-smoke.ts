/**
 * Smoke test: protected route returns 401 without a Bearer token.
 * Requires CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY in backend/.env
 * Run: bun run test:auth
 */
import 'dotenv/config';

import { clerkMiddleware } from '@clerk/express';
import express from 'express';

import { assertClerkEnv } from './config/clerk';
import { authenticate } from './middlewares/auth.middleware';

try {
  assertClerkEnv();
} catch (error) {
  console.log('SKIP auth smoke test:', (error as Error).message);
  process.exit(0);
}

const app = express();
app.use(clerkMiddleware());
app.use(express.json());

app.post('/api/offers', authenticate, (_req, res) => {
  res.status(201).json({ ok: true });
});

const server = app.listen(0, async () => {
  const port = (server.address() as { port: number }).port;
  const base = `http://127.0.0.1:${port}`;

  const unauth = await fetch(`${base}/api/offers`, { method: 'POST' });
  const pass = unauth.status === 401;
  console.log('POST /api/offers without token:', unauth.status, pass ? 'PASS' : 'FAIL');

  server.close();
  process.exit(pass ? 0 : 1);
});
