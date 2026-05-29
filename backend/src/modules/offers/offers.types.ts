export type CreateOfferInput = {
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  imageUrl?: string;
  isPublic?: boolean;
};

export type UpdateOfferInput = {
  title?: string;
  description?: string;
  discount?: string;
  validUntil?: string;
  imageUrl?: string;
  isPublic?: boolean;
};

export type OfferStatus = 'active' | 'expired';
