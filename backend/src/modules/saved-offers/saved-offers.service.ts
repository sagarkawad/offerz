import * as repository from './saved-offers.repository';

export class SavedOfferServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'SavedOfferServiceError';
  }
}

export const getSavedOffers = async (userId: string) => repository.findManyByUserId(userId);

export const saveOffer = async (userId: string, offerId: string) => {
  const offerOk = await repository.offerExists(offerId);
  if (!offerOk) {
    throw new SavedOfferServiceError('Offer not found', 404);
  }

  const existing = await repository.findSavedOffer(userId, offerId);
  if (existing) {
    return existing;
  }

  return repository.create(userId, offerId);
};

export const unsaveOffer = async (userId: string, offerId: string) => {
  const existing = await repository.findSavedOffer(userId, offerId);
  if (!existing) {
    throw new SavedOfferServiceError('Saved offer not found', 404);
  }

  return repository.remove(userId, offerId);
};
