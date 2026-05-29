export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
};

export type ApiLocation = {
  id: string;
  label: string;
  sortOrder: number;
};

export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
};

export type ApiOffersList = {
  offers: ApiOffer[];
  expandedToOtherLocations: boolean;
};

export type ApiOffer = {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  imageUrl?: string | null;
  isPublic: boolean;
  shopId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  shop: {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    locationId: string;
    ownerId: string;
    location: ApiLocation;
    categories: ApiCategory[];
  };
};

export type ApiUser = {
  clerkId: string;
  role: 'BUYER' | 'SHOPKEEPER';
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiShopSummary = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isPublic: boolean;
  approved: boolean;
  locationId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  location: ApiLocation;
  categories: ApiCategory[];
  offerCount: number;
  activeOfferCount: number;
  expiredOfferCount: number;
};

export type ApiSellerOffer = ApiOffer & {
  status: 'active' | 'expired';
};

export type ApiAdminShop = ApiShopSummary & {
  owner: {
    clerkId: string;
    role: 'BUYER' | 'SHOPKEEPER';
  };
};
