export type CreateShopInput = {
  name: string;
  locationId: string;
  categoryIds: string[];
  description?: string;
  imageUrl?: string;
  isPublic?: boolean;
};

export type UpdateShopInput = {
  name?: string;
  description?: string;
  imageUrl?: string;
  categoryIds?: string[];
  isPublic?: boolean;
};
