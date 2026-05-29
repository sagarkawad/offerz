import prisma from '../../prisma/client';

import { offerInclude } from './offers.includes';

export const findMany = async (locationId?: string, categoryId?: string) => {
  const where = {
    ...(locationId ? { shop: { locationId } } : {}),
    ...(categoryId ? { categoryId } : {}),
  };

  return prisma.offer.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: offerInclude,
    orderBy: { createdAt: 'desc' },
  });
};

export const findById = async (id: string) => {
  return prisma.offer.findUnique({
    where: { id },
    include: offerInclude,
  });
};

export const create = async (data: {
  title: string;
  description: string;
  discount: string;
  validUntil: Date;
  shopId: string;
  categoryId: string;
  createdById: string;
  imageUrl?: string;
}) => {
  return prisma.offer.create({
    data,
    include: offerInclude,
  });
};

export const shopExists = async (shopId: string) => {
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  return Boolean(shop);
};

export const categoryExists = async (categoryId: string) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  return Boolean(category);
};
