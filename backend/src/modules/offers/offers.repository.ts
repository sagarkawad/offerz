import prisma from '../../prisma/client';

import { offerInclude } from './offers.includes';
import { startOfToday } from './offers.utils';
import type { OfferStatus } from './offers.types';

export const findMany = async (locationId?: string, categoryId?: string) => {
  const shopFilter = {
    ...(locationId ? { locationId } : {}),
    ...(categoryId ? { categories: { some: { categoryId } } } : {}),
  };

  const where = {
    validUntil: { gte: new Date() },
    ...(Object.keys(shopFilter).length > 0 ? { shop: shopFilter } : {}),
  };

  return prisma.offer.findMany({
    where,
    include: offerInclude,
    orderBy: { createdAt: 'desc' },
  });
};

export const findByShopId = async (shopId: string, status: OfferStatus | 'all' = 'all') => {
  const now = startOfToday();
  const validUntilFilter =
    status === 'active'
      ? { gte: now }
      : status === 'expired'
        ? { lt: now }
        : undefined;

  return prisma.offer.findMany({
    where: {
      shopId,
      ...(validUntilFilter ? { validUntil: validUntilFilter } : {}),
    },
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
  createdById: string;
  imageUrl?: string;
}) => {
  return prisma.offer.create({
    data,
    include: offerInclude,
  });
};

export const update = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    discount?: string;
    validUntil?: Date;
    imageUrl?: string | null;
  },
) => {
  return prisma.offer.update({
    where: { id },
    data,
    include: offerInclude,
  });
};

export const remove = async (id: string) => {
  return prisma.offer.delete({
    where: { id },
  });
};

export const shopExists = async (shopId: string) => {
  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  return Boolean(shop);
};
