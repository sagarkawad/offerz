import prisma from '../../prisma/client';

export const findByOwner = async (ownerId: string) => {
  return prisma.shop.findMany({
    where: { ownerId },
    include: {
      location: true,
      _count: { select: { offers: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const findById = async (id: string) => {
  return prisma.shop.findUnique({
    where: { id },
    include: {
      location: true,
      offers: {
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

export const create = async (data: {
  name: string;
  locationId: string;
  ownerId: string;
  description?: string;
  imageUrl?: string;
}) => {
  return prisma.shop.create({
    data,
    include: { location: true },
  });
};

export const update = async (
  id: string,
  data: { name?: string; description?: string; imageUrl?: string },
) => {
  return prisma.shop.update({
    where: { id },
    data,
    include: { location: true },
  });
};

export const remove = async (id: string) => {
  return prisma.shop.delete({ where: { id } });
};

export const locationExists = async (locationId: string) => {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });
  return Boolean(location);
};
