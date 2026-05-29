import type { Request, Response } from 'express';

import * as service from './saved-offers.service';
import { SavedOfferServiceError } from './saved-offers.service';

export const getSavedOffers = async (req: Request, res: Response) => {
  try {
    const offers = await service.getSavedOffers(req.user!.clerkId);

    res.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const saveOffer = async (req: Request, res: Response) => {
  try {
    await service.saveOffer(req.user!.clerkId, req.params.offerId);

    res.status(201).json({
      success: true,
      data: { offerId: req.params.offerId },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const unsaveOffer = async (req: Request, res: Response) => {
  try {
    await service.unsaveOffer(req.user!.clerkId, req.params.offerId);

    res.json({
      success: true,
      data: { offerId: req.params.offerId },
    });
  } catch (error) {
    handleError(error, res);
  }
};

function handleError(error: unknown, res: Response) {
  if (error instanceof SavedOfferServiceError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  throw error;
}
