import { useCallback, useEffect, useState } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiShopSummary } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';
import { mapApiShopSummaries } from '@/lib/mappers';
import type { ShopSummary } from '@/types/shop';

export function useMyShops(locationId: string, categoryId: string, enabled = true) {
  const { fetchApi } = useApi();
  const [shops, setShops] = useState<ShopSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) {
      setShops([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (locationId) {
        params.set('locationId', locationId);
      }
      if (categoryId) {
        params.set('categoryId', categoryId);
      }

      const query = params.toString();
      const response = await fetchApi(`/api/shops/mine${query ? `?${query}` : ''}`);
      const data = await parseApiResponse<ApiShopSummary[]>(response);
      setShops(mapApiShopSummaries(data));
    } catch (err) {
      setShops([]);
      setError(err instanceof Error ? err.message : 'Failed to load shops');
    } finally {
      setIsLoading(false);
    }
  }, [enabled, fetchApi, locationId, categoryId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { shops, isLoading, error, refetch };
}
