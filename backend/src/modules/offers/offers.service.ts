import * as repository from './offers.repository';
import type { CreateOfferInput } from './offers.types';

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

export const createOfferForShop = async (
  shopId: string,
  input: CreateOfferInput,
  createdById: string,
) => {
  const shopOk = await repository.shopExists(shopId);
  if (!shopOk) {
    throw new OfferServiceError('Shop not found', 404);
  }

  const categoryOk = await repository.categoryExists(input.categoryId);
  if (!categoryOk) {
    throw new OfferServiceError('Unknown category', 400);
  }

  const { validUntil, ...rest } = input;

  return repository.create({
    ...rest,
    validUntil: new Date(validUntil),
    shopId,
    createdById,
  });
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
