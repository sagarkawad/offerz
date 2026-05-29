import { getClerkClient } from '../../config/clerk';
import prisma from '../../prisma/client';
import * as repository from './users.repository';

export const getCurrentUser = async (clerkId: string) => {
  const user = await repository.findByClerkId(clerkId);
  if (!user) {
    throw new UserServiceError('User not found', 404);
  }
  return user;
};

export const syncCurrentUser = async (clerkId: string) => repository.upsertBuyer(clerkId);

export class UserServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'UserServiceError';
  }
}

export const deleteCurrentUser = async (clerkId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (existingUser) {
    await repository.deleteByClerkId(clerkId);
  }

  const clerk = getClerkClient();
  await clerk.users.deleteUser(clerkId);
};
