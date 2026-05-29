import * as offersService from '../offers/offers.service';
import type { CreateOfferInput } from '../offers/offers.types';
import * as repository from './shops.repository';
import type { CreateShopInput, UpdateShopInput } from './shops.types';

export const getMyShops = async (ownerId: string) => repository.findByOwner(ownerId);

export const getShopById = async (id: string) => repository.findById(id);

export const createShop = async (input: CreateShopInput, ownerId: string) => {
  const exists = await repository.locationExists(input.locationId);
  if (!exists) {
    throw new ShopServiceError('Unknown location', 400);
  }

  return repository.create({
    name: input.name,
    locationId: input.locationId,
    ownerId,
    description: input.description,
    imageUrl: input.imageUrl,
  });
};

export const updateShop = async (id: string, input: UpdateShopInput) => {
  return repository.update(id, input);
};

export const deleteShop = async (id: string) => repository.remove(id);

export const createOfferForShop = async (
  shopId: string,
  input: CreateOfferInput,
  createdById: string,
) => {
  return offersService.createOfferForShop(shopId, input, createdById);
};

export class ShopServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ShopServiceError';
  }
}
