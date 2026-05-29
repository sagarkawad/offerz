export const shopInclude = {
  location: true,
  categories: {
    include: { category: true },
  },
} as const;

export const shopIncludeWithOffers = {
  ...shopInclude,
  offers: {
    select: { validUntil: true },
  },
} as const;

type ShopWithCategories = {
  categories: Array<{ category: { id: string; slug: string; name: string; sortOrder: number } }>;
};

export function mapShopCategories<T extends ShopWithCategories>(shop: T) {
  return shop.categories
    .map((entry) => entry.category)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
