export type ShopSummary = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isPublic: boolean;
  approved: boolean;
  locationId: string;
  locationLabel: string;
  categories: ShopCategory[];
  offerCount: number;
  activeOfferCount: number;
  expiredOfferCount: number;
};

export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
};

export type SellerOffer = {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  shopId: string;
  categoryNames: string;
  status: 'active' | 'expired';
  isPublic: boolean;
  imageUrl?: string;
};

export type AdminShop = ShopSummary & {
  ownerId: string;
  createdAt: string;
};
