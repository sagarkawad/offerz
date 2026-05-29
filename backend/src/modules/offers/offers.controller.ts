import type { Request, Response } from 'express';

import * as service from './offers.service';

export const getOffers = async (req: Request, res: Response) => {
  const locationId =
    typeof req.query.locationId === 'string' ? req.query.locationId : undefined;
  const categoryId =
    typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;

  const result = await service.getOffers(locationId, categoryId);

  res.json({
    success: true,
    data: result,
  });
};

export const getOfferById = async (req: Request, res: Response) => {
  const offer = await service.getOfferById(req.params.id);

  if (!offer) {
    return res.status(404).json({ success: false, error: 'Offer not found' });
  }

  res.json({
    success: true,
    data: offer,
  });
};
