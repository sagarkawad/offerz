import { useCallback, useEffect, useState } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiAdminShop } from '@/lib/api-types';
import { mapApiAdminShops } from '@/lib/mappers';
import { parseApiResponse } from '@/lib/api';
import type { AdminShop } from '@/types/shop';

export type AdminShopFilter = 'pending' | 'approved' | 'all';

export function useAdminShops(filter: AdminShopFilter = 'pending', enabled = true) {
  const { fetchApi } = useApi();
  const [shops, setShops] = useState<AdminShop[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchApi(`/api/admin/shops?approved=${filter}`);
      const data = await parseApiResponse<ApiAdminShop[]>(response);
      setShops(mapApiAdminShops(data));
    } catch (err) {
      setShops([]);
      setError(err instanceof Error ? err.message : 'Failed to load shops');
    } finally {
      setIsLoading(false);
    }
  }, [enabled, fetchApi, filter]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { shops, isLoading, error, refetch };
}
