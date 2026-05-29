import prisma from '../../prisma/client';

import { mapShopCategories, shopInclude } from '../shops/shops.includes';
import type { AdminShopApprovalFilter } from './admin.types';

function approvalFilter(filter: AdminShopApprovalFilter) {
  if (filter === 'pending') {
    return { approved: false };
  }
  if (filter === 'approved') {
    return { approved: true };
  }
  return {};
}

export const findShops = async (filter: AdminShopApprovalFilter = 'pending') => {
  const shops = await prisma.shop.findMany({
    where: approvalFilter(filter),
    include: {
      ...shopInclude,
      owner: {
        select: { clerkId: true, role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return shops.map(({ categories, owner, ...rest }) => ({
    ...rest,
    categories: mapShopCategories({ categories }),
    owner,
  }));
};

export const updateShopApproval = async (id: string, approved: boolean) => {
  const shop = await prisma.shop.update({
    where: { id },
    data: { approved },
    include: {
      ...shopInclude,
      owner: {
        select: { clerkId: true, role: true },
      },
    },
  });

  const { categories, owner, ...rest } = shop;

  return {
    ...rest,
    categories: mapShopCategories({ categories }),
    owner,
  };
};

export const shopExists = async (id: string) => {
  const shop = await prisma.shop.findUnique({ where: { id } });
  return Boolean(shop);
};
