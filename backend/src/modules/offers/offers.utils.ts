export function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getOfferStatus(validUntil: Date): 'active' | 'expired' {
  return validUntil >= startOfToday() ? 'active' : 'expired';
}
