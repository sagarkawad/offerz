import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';

import * as service from './users.service';
import { UserServiceError } from './users.service';

export const getMe = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await service.getCurrentUser(userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof UserServiceError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    throw error;
  }
};

export const syncMe = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await service.syncCurrentUser(userId);

  res.json({
    success: true,
    data: user,
  });
};

export const deleteMe = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await service.deleteCurrentUser(userId);

    res.json({
      success: true,
      data: { deleted: true },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Could not delete account',
    });
  }
};
