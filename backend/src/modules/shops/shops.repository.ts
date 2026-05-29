import prisma from '../../prisma/client';

import { offerInclude } from '../offers/offers.includes';
import { startOfToday } from '../offers/offers.utils';
import {
  mapShopCategories,
  shopInclude,
  shopIncludeWithOffers,
} from './shops.includes';

function mapShopSummary(
  shop: Awaited<ReturnType<typeof prisma.shop.findMany>>[number] & {
    offers: Array<{ validUntil: Date }>;
    categories: Array<{ category: { id: string; slug: string; name: string; sortOrder: number } }>;
  },
) {
  const now = startOfToday();
  const { offers, categories, ...rest } = shop;

  return {
    ...rest,
    categories: mapShopCategories({ categories }),
    offerCount: offers.length,
    activeOfferCount: offers.filter((offer) => offer.validUntil >= now).length,
    expiredOfferCount: offers.filter((offer) => offer.validUntil < now).length,
  };
}

export const findByOwner = async (
  ownerId: string,
  locationId?: string,
  categoryId?: string,
) => {
  const where = {
    ownerId,
    ...(locationId && locationId !== 'all' ? { locationId } : {}),
    ...(categoryId && categoryId !== 'all'
      ? { categories: { some: { categoryId } } }
      : {}),
  };

  const shops = await prisma.shop.findMany({
    where,
    include: shopIncludeWithOffers,
    orderBy: { createdAt: 'desc' },
  });

  return shops.map(mapShopSummary);
};

export const findById = async (id: string) => {
  const shop = await prisma.shop.findUnique({
    where: { id },
    include: {
      ...shopInclude,
      offers: {
        orderBy: { createdAt: 'desc' },
        include: offerInclude,
      },
    },
  });

  if (!shop) {
    return null;
  }

  const { categories, offers, ...rest } = shop;

  return {
    ...rest,
    categories: mapShopCategories({ categories }),
    offers,
  };
};

export const findByIdPublic = async (id: string) => {
  const shop = await prisma.shop.findFirst({
    where: {
      id,
      approved: true,
      isPublic: true,
    },
    include: {
      ...shopInclude,
      offers: {
        where: {
          isPublic: true,
          validUntil: { gte: startOfToday() },
        },
        orderBy: { createdAt: 'desc' },
        include: offerInclude,
      },
    },
  });

  if (!shop) {
    return null;
  }

  const { categories, offers, ...rest } = shop;

  return {
    ...rest,
    categories: mapShopCategories({ categories }),
    offers,
  };
};

export const create = async (data: {
  name: string;
  locationId: string;
  ownerId: string;
  categoryIds: string[];
  description?: string;
  imageUrl?: string;
  isPublic?: boolean;
}) => {
  const { categoryIds, isPublic = false, ...shopData } = data;

  const shop = await prisma.shop.create({
    data: {
      ...shopData,
      isPublic,
      approved: false,
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
    },
    include: shopIncludeWithOffers,
  });

  return mapShopSummary(shop);
};

export const update = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
    categoryIds?: string[];
    isPublic?: boolean;
  },
) => {
  const { categoryIds, ...shopData } = data;

  const shop = await prisma.$transaction(async (tx) => {
    if (categoryIds) {
      await tx.shopCategory.deleteMany({ where: { shopId: id } });
      if (categoryIds.length > 0) {
        await tx.shopCategory.createMany({
          data: categoryIds.map((categoryId) => ({ shopId: id, categoryId })),
        });
      }
    }

    if (shopData.isPublic === false) {
      await tx.offer.updateMany({
        where: { shopId: id },
        data: { isPublic: false },
      });
    }

    return tx.shop.update({
      where: { id },
      data: shopData,
      include: shopIncludeWithOffers,
    });
  });

  return mapShopSummary(shop);
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

export const categoriesExist = async (categoryIds: string[]) => {
  if (categoryIds.length === 0) {
    return false;
  }

  const count = await prisma.category.count({
    where: { id: { in: categoryIds } },
  });

  return count === categoryIds.length;
};
