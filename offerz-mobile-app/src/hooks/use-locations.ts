import { useCallback, useEffect, useState } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiLocation } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';
import { mapApiLocation, type Location } from '@/lib/mappers';

export function useLocations() {
  const { fetchApi } = useApi();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchApi('/api/locations');
      const data = await parseApiResponse<ApiLocation[]>(response);
      setLocations(data.map(mapApiLocation));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchApi]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { locations, isLoading, error, refetch };
}
