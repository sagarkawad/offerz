export const offerInclude = {
  shop: { include: { location: true } },
  category: true,
} as const;
