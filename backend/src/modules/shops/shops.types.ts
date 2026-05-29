export type CreateShopInput = {
  name: string;
  locationId: string;
  description?: string;
  imageUrl?: string;
};

export type UpdateShopInput = {
  name?: string;
  description?: string;
  imageUrl?: string;
};
