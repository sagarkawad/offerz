import type { NextFunction, Request, Response } from 'express';

import * as service from './admin.service';
import type { AdminShopApprovalFilter, UpdateShopApprovalInput } from './admin.types';
import { AdminServiceError } from './admin.service';

function parseApprovalFilter(value: unknown): AdminShopApprovalFilter {
  if (value === 'approved' || value === 'all') {
    return value;
  }
  return 'pending';
}

export const getShops = async (req: Request, res: Response) => {
  const filter = parseApprovalFilter(req.query.approved);
  const shops = await service.getShops(filter);
  res.json({ success: true, data: shops });
};

export const updateShopApproval = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { approved } = req.body as UpdateShopApprovalInput;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ success: false, error: 'approved must be a boolean' });
    }

    const shop = await service.updateShopApproval(String(req.params.id), { approved });
    res.json({ success: true, data: shop });
  } catch (error) {
    if (error instanceof AdminServiceError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    next(error);
  }
};
