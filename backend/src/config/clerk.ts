import { createClerkClient } from '@clerk/backend';

export function assertClerkEnv(): void {
  const missing: string[] = [];

  if (!process.env.CLERK_SECRET_KEY) {
    missing.push('CLERK_SECRET_KEY');
  }
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    missing.push('CLERK_PUBLISHABLE_KEY');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing Clerk environment variables: ${missing.join(', ')}. Copy backend/.env.example to backend/.env and add your keys from https://dashboard.clerk.com`,
    );
  }
}

export function getClerkClient() {
  assertClerkEnv();

  return createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });
}
