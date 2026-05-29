import { clerkMiddleware } from '@clerk/express';
import express from 'express';

import routes from './routes';

const app = express();

app.use(clerkMiddleware());
app.use(express.json());
app.use('/api', routes);

export default app;
