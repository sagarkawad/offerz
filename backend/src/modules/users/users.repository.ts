import prisma from '../../prisma/client';

export const upsertBuyer = async (clerkId: string) => {
  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, role: 'BUYER' },
    update: {},
  });
};
