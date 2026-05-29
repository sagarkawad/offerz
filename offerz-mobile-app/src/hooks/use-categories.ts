import { useCallback, useEffect, useState } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiCategory } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';
import { mapApiCategory, type Category } from '@/lib/mappers';

export function useCategories() {
  const { fetchApi } = useApi();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchApi('/api/categories');
      const data = await parseApiResponse<ApiCategory[]>(response);
      setCategories(data.map(mapApiCategory));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchApi]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { categories, isLoading, error, refetch };
}
