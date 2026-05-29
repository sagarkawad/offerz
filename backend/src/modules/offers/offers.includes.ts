import { shopInclude } from '../shops/shops.includes';

export const offerInclude = {
  shop: {
    include: shopInclude,
  },
} as const;
