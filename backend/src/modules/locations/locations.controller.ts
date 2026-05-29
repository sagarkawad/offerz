import type { Request, Response } from 'express';

import * as service from './locations.service';

export const getLocations = async (_req: Request, res: Response) => {
  const locations = await service.getLocations();
  res.json({ success: true, data: locations });
};
