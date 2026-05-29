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
  const shopOk = await repository.shopExists(shopId);
  if (!shopOk) {
    throw new OfferServiceError('Shop not found', 404);
  }

  const { validUntil, ...rest } = input;

  const offer = await repository.create({
    ...rest,
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
  const existing = await repository.findById(offerId);
  if (!existing || existing.shopId !== shopId) {
    throw new OfferServiceError('Offer not found', 404);
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
  const existing = await repository.findById(offerId);
  if (!existing || existing.shopId !== shopId) {
    throw new OfferServiceError('Offer not found', 404);
  }

  await repository.remove(offerId);
};

export class OfferServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'OfferServiceError';
  }
}
