import * as repository from './admin.repository';
import type { AdminShopApprovalFilter, UpdateShopApprovalInput } from './admin.types';

export const getShops = async (filter: AdminShopApprovalFilter = 'pending') =>
  repository.findShops(filter);

export const updateShopApproval = async (id: string, input: UpdateShopApprovalInput) => {
  const exists = await repository.shopExists(id);
  if (!exists) {
    throw new AdminServiceError('Shop not found', 404);
  }

  return repository.updateShopApproval(id, input.approved);
};

export class AdminServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'AdminServiceError';
  }
}
