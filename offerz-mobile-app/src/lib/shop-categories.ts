import type { ShopCategory, ShopSummary } from '@/types/shop';

export function getUniqueShopCategories(shops: ShopSummary[]): ShopCategory[] {
  const byId = new Map<string, ShopCategory>();

  for (const shop of shops) {
    for (const category of shop.categories) {
      byId.set(category.id, category);
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}
