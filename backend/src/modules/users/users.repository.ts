import prisma from '../../prisma/client';

export const findByClerkId = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkId },
  });
};

export const upsertBuyer = async (clerkId: string) => {
  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, role: 'BUYER' },
    update: {},
  });
};

export const deleteByClerkId = async (clerkId: string) => {
  return prisma.user.delete({
    where: { clerkId },
  });
};
