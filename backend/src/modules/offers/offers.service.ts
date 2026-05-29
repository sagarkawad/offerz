import * as repository from './offers.repository';
import type { CreateOfferInput, OfferStatus, UpdateOfferInput } from './offers.types';
import { getOfferStatus } from './offers.utils';

export type GetOffersResult = {
  offers: Awaited<ReturnType<typeof repository.findMany>>;
  expandedToOtherLocations: boolean;
};

export const getOffers = async (
  locationId?: string,
  categoryId?: string,
): Promise<GetOffersResult> => {
  const offers = await repository.findMany(locationId, categoryId);

  if (offers.length === 0 && locationId) {
    const fallbackOffers = await repository.findMany(undefined, categoryId);
    if (fallbackOffers.length > 0) {
      return { offers: fallbackOffers, expandedToOtherLocations: true };
    }
  }

  return { offers, expandedToOtherLocations: false };
};

export const getOfferById = async (id: string) => repository.findById(id);

export const getOffersForShop = async (shopId: string, status: OfferStatus | 'all' = 'all') => {
  const offers = await repository.findByShopId(shopId, status);
  return offers.map((offer) => ({
    ...offer,
    status: getOfferStatus(offer.validUntil),
  }));
};

export const createOfferForShop = async (
  shopId: string,
  input: CreateOfferInput,
  createdById: string,
) => {
  const shop = await repository.findShopById(shopId);
  if (!shop) {
    throw new OfferServiceError('Shop not found', 404);
  }

  if (!shop.approved) {
    throw new OfferServiceError('Shop must be approved before you can add offers', 400);
  }

  const isPublic = input.isPublic ?? false;
  if (isPublic) {
    assertOfferCanBePublic(shop);
  }

  const { validUntil, isPublic: _isPublic, ...rest } = input;

  const offer = await repository.create({
    ...rest,
    isPublic,
    validUntil: new Date(validUntil),
    shopId,
    createdById,
  });

  return {
    ...offer,
    status: getOfferStatus(offer.validUntil),
  };
};

export const updateOfferForShop = async (
  shopId: string,
  offerId: string,
  input: UpdateOfferInput,
) => {
  const existing = await repository.findByIdForOwner(offerId);
  if (!existing || existing.shopId !== shopId) {
    throw new OfferServiceError('Offer not found', 404);
  }

  if (input.isPublic === true) {
    const shop = await repository.findShopById(shopId);
    if (!shop) {
      throw new OfferServiceError('Shop not found', 404);
    }
    assertOfferCanBePublic(shop);
  }

  const { validUntil, ...rest } = input;

  const offer = await repository.update(offerId, {
    ...rest,
    ...(validUntil ? { validUntil: new Date(validUntil) } : {}),
  });

  return {
    ...offer,
    status: getOfferStatus(offer.validUntil),
  };
};

export const deleteOfferForShop = async (shopId: string, offerId: string) => {
  const existing = await repository.findByIdForOwner(offerId);
  if (!existing || existing.shopId !== shopId) {
    throw new OfferServiceError('Offer not found', 404);
  }

  await repository.remove(offerId);
};

function assertOfferCanBePublic(shop: { isPublic: boolean }) {
  if (!shop.isPublic) {
    throw new OfferServiceError('Shop must be public before offers can be made public', 400);
  }
}

export class OfferServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'OfferServiceError';
  }
}
