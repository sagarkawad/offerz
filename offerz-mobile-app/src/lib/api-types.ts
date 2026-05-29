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
  shopId: string;
  categoryId: string;
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
  };
  category: ApiCategory;
};

export type ApiUser = {
  clerkId: string;
  role: 'BUYER' | 'SHOPKEEPER';
  createdAt: string;
  updatedAt: string;
};
