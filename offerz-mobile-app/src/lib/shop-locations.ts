import type { ShopSummary } from '@/types/shop';

export type ShopLocation = {
  id: string;
  label: string;
};

export function getUniqueShopLocations(shops: ShopSummary[]): ShopLocation[] {
  const byId = new Map<string, ShopLocation>();

  for (const shop of shops) {
    byId.set(shop.locationId, { id: shop.locationId, label: shop.locationLabel });
  }

  return Array.from(byId.values()).sort((a, b) => a.label.localeCompare(b.label));
}
