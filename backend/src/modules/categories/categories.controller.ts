import type { Request, Response } from 'express';

import * as service from './categories.service';

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await service.getCategories();
  res.json({ success: true, data: categories });
};
