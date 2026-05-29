import type { NextFunction, Request, Response } from 'express';

import { OfferServiceError } from '../offers/offers.service';
import type { CreateOfferInput, OfferStatus, UpdateOfferInput } from '../offers/offers.types';
import * as service from './shops.service';
import type { CreateShopInput, UpdateShopInput } from './shops.types';
import { ShopServiceError } from './shops.service';

function parseFilterParam(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }
  return value;
}

function parseOfferStatus(value: unknown): OfferStatus | 'all' {
  if (value === 'active' || value === 'expired') {
    return value;
  }
  return 'all';
}

export const getMyShops = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ success: false, error: 'Shopkeeper access required' });
  }

  const locationId = parseFilterParam(req.query.locationId);
  const categoryId = parseFilterParam(req.query.categoryId);
  const shops = await service.getMyShops(req.user.clerkId, locationId, categoryId);
  res.json({ success: true, data: shops });
};

export const getShopById = async (req: Request, res: Response) => {
  const shop = await service.getShopById(req.params.id);

  if (!shop) {
    return res.status(404).json({ success: false, error: 'Shop not found' });
  }

  res.json({ success: true, data: shop });
};

export const createShop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(403).json({ success: false, error: 'Shopkeeper access required' });
    }

    const shop = await service.createShop(req.body as CreateShopInput, req.user.clerkId);
    res.status(201).json({ success: true, data: shop });
  } catch (error) {
    handleServiceError(error, next, res);
  }
};

export const updateShop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shop = await service.updateShop(req.params.id, req.body as UpdateShopInput);
    res.json({ success: true, data: shop });
  } catch (error) {
    handleServiceError(error, next, res);
  }
};

export const deleteShop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.deleteShop(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleServiceError(error, next, res);
  }
};

export const getShopOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.shop) {
      return res.status(403).json({ success: false, error: 'Shopkeeper access required' });
    }

    const status = parseOfferStatus(req.query.status);
    const offers = await service.getOffersForShop(req.shop.id, status);
    res.json({ success: true, data: offers });
  } catch (error) {
    handleServiceError(error, next, res);
  }
};

export const createOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.shop) {
      return res.status(403).json({ success: false, error: 'Shopkeeper access required' });
    }

    const offer = await service.createOfferForShop(
      req.shop.id,
      req.body as CreateOfferInput,
      req.user.clerkId,
    );

    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    handleServiceError(error, next, res);
  }
};

export const updateOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.shop) {
      return res.status(403).json({ success: false, error: 'Shopkeeper access required' });
    }

    const offer = await service.updateOfferForShop(
      req.shop.id,
      req.params.offerId,
      req.body as UpdateOfferInput,
    );

    res.json({ success: true, data: offer });
  } catch (error) {
    handleServiceError(error, next, res);
  }
};

export const deleteOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.shop) {
      return res.status(403).json({ success: false, error: 'Shopkeeper access required' });
    }

    await service.deleteOfferForShop(req.shop.id, req.params.offerId);
    res.status(204).send();
  } catch (error) {
    handleServiceError(error, next, res);
  }
};

function handleServiceError(error: unknown, next: NextFunction, res: Response) {
  if (error instanceof ShopServiceError || error instanceof OfferServiceError) {
    const err = error as ShopServiceError | OfferServiceError;
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }
  next(error);
}
