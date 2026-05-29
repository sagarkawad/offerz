import 'dotenv/config';

import app from './app';
import { assertClerkEnv } from './config/clerk';
import prisma from './prisma/client';

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    assertClerkEnv();
    await prisma.$connect();

    console.log('Database connected');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process and try again.`);
      } else {
        console.error('Failed to start server', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
