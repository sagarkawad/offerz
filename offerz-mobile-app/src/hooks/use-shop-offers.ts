import { useCallback, useEffect, useState } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiSellerOffer } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';
import { mapApiSellerOffers } from '@/lib/mappers';
import type { SellerOffer } from '@/types/shop';

export type OfferStatusFilter = 'active' | 'expired' | 'all';

export function useShopOffers(shopId: string, status: OfferStatusFilter) {
  const { fetchApi } = useApi();
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!shopId) {
      setOffers([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ status });
      const response = await fetchApi(`/api/shops/${encodeURIComponent(shopId)}/offers?${params.toString()}`);
      const data = await parseApiResponse<ApiSellerOffer[]>(response);
      setOffers(mapApiSellerOffers(data));
    } catch (err) {
      setOffers([]);
      setError(err instanceof Error ? err.message : 'Failed to load offers');
    } finally {
      setIsLoading(false);
    }
  }, [fetchApi, shopId, status]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { offers, isLoading, error, refetch };
}
