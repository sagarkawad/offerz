import type { NextFunction, Request, Response } from 'express';

import { OfferServiceError } from '../offers/offers.service';
import type { CreateOfferInput } from '../offers/offers.types';
import * as service from './shops.service';
import type { CreateShopInput, UpdateShopInput } from './shops.types';
import { ShopServiceError } from './shops.service';

export const getMyShops = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ success: false, error: 'Shopkeeper access required' });
  }

  const shops = await service.getMyShops(req.user.clerkId);
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

function handleServiceError(error: unknown, next: NextFunction, res: Response) {
  if (error instanceof ShopServiceError || error instanceof OfferServiceError) {
    const err = error as ShopServiceError | OfferServiceError;
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }
  next(error);
}
