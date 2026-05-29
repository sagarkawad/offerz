import prisma from '../../prisma/client';

export const findAll = async () => {
  return prisma.location.findMany({
    orderBy: { sortOrder: 'asc' },
  });
};
