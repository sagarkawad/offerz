import { useCallback, useEffect, useState } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiOffersList } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';
import { mapApiOffers } from '@/lib/mappers';
import type { Offer } from '@/types/offer';

export function useOffers(locationId: string, categoryId: string) {
  const { fetchApi } = useApi();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expandedToOtherLocations, setExpandedToOtherLocations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!locationId || !categoryId) {
      setOffers([]);
      setExpandedToOtherLocations(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        locationId,
        categoryId,
      });
      const response = await fetchApi(`/api/offers?${params.toString()}`);
      const data = await parseApiResponse<ApiOffersList>(response);
      setOffers(mapApiOffers(data.offers));
      setExpandedToOtherLocations(data.expandedToOtherLocations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load offers');
      setOffers([]);
      setExpandedToOtherLocations(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchApi, locationId, categoryId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { offers, expandedToOtherLocations, isLoading, error, refetch };
}
