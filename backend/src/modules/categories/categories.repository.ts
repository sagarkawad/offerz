import prisma from '../../prisma/client';

export const findAll = async () => {
  return prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });
};
