import * as repository from './users.repository';

export const syncCurrentUser = async (clerkId: string) => repository.upsertBuyer(clerkId);
