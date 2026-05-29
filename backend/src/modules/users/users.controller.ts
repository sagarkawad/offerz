import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';

import * as service from './users.service';

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
