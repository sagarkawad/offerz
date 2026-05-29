export type CreateOfferInput = {
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  imageUrl?: string;
};

export type UpdateOfferInput = {
  title?: string;
  description?: string;
  discount?: string;
  validUntil?: string;
  imageUrl?: string;
};

export type OfferStatus = 'active' | 'expired';
