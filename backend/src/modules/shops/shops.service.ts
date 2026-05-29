import * as offersService from '../offers/offers.service';
import type { CreateOfferInput, OfferStatus, UpdateOfferInput } from '../offers/offers.types';
import * as repository from './shops.repository';
import type { CreateShopInput, UpdateShopInput } from './shops.types';

export const getMyShops = async (
  ownerId: string,
  locationId?: string,
  categoryId?: string,
) => repository.findByOwner(ownerId, locationId, categoryId);

export const getShopById = async (id: string) => repository.findById(id);

export const createShop = async (input: CreateShopInput, ownerId: string) => {
  if (!input.categoryIds?.length) {
    throw new ShopServiceError('At least one category is required', 400);
  }

  const locationOk = await repository.locationExists(input.locationId);
  if (!locationOk) {
    throw new ShopServiceError('Unknown location', 400);
  }

  const categoriesOk = await repository.categoriesExist(input.categoryIds);
  if (!categoriesOk) {
    throw new ShopServiceError('Unknown category', 400);
  }

  return repository.create({
    name: input.name,
    locationId: input.locationId,
    ownerId,
    categoryIds: input.categoryIds,
    description: input.description,
    imageUrl: input.imageUrl,
  });
};

export const updateShop = async (id: string, input: UpdateShopInput) => {
  if (input.categoryIds !== undefined) {
    if (input.categoryIds.length === 0) {
      throw new ShopServiceError('At least one category is required', 400);
    }

    const categoriesOk = await repository.categoriesExist(input.categoryIds);
    if (!categoriesOk) {
      throw new ShopServiceError('Unknown category', 400);
    }
  }

  return repository.update(id, input);
};

export const deleteShop = async (id: string) => repository.remove(id);

export const createOfferForShop = async (
  shopId: string,
  input: CreateOfferInput,
  createdById: string,
) => offersService.createOfferForShop(shopId, input, createdById);

export const getOffersForShop = async (shopId: string, status: OfferStatus | 'all' = 'all') =>
  offersService.getOffersForShop(shopId, status);

export const updateOfferForShop = async (
  shopId: string,
  offerId: string,
  input: UpdateOfferInput,
) => offersService.updateOfferForShop(shopId, offerId, input);

export const deleteOfferForShop = async (shopId: string, offerId: string) =>
  offersService.deleteOfferForShop(shopId, offerId);

export class ShopServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ShopServiceError';
  }
}
