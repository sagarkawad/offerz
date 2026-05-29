import type { NextFunction, Request, Response } from 'express';

import prisma from '../prisma/client';

export async function ensureShopOwner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const shopId = req.params.shopId ?? req.params.id;

  if (!shopId) {
    return res.status(400).json({ error: 'Shop id is required' });
  }

  if (!req.user) {
    return res.status(403).json({ error: 'Shopkeeper access required' });
  }

  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
  });

  if (!shop) {
    return res.status(404).json({ error: 'Shop not found' });
  }

  if (shop.ownerId !== req.user.clerkId) {
    return res.status(403).json({ error: 'You do not own this shop' });
  }

  req.shop = shop;
  next();
}
