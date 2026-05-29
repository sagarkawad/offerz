import { getAuth } from '@clerk/express';
import type { NextFunction, Request, Response } from 'express';

import prisma from '../prisma/client';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const { isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

export async function requireShopkeeper(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return res.status(403).json({
      error: 'User profile not found. Set your role before creating offers.',
    });
  }

  if (user.role !== 'SHOPKEEPER') {
    return res.status(403).json({
      error: 'Only shopkeepers can create offers',
    });
  }

  req.user = user;
  next();
}

export async function requireBuyer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, role: 'BUYER' },
    update: {},
  });

  req.user = user;
  next();
}
