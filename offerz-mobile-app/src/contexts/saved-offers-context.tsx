import { useAuth } from '@clerk/expo';
import { type Href, useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiOffer } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';
import { mapApiOffers } from '@/lib/mappers';
import type { Offer } from '@/types/offer';

type SavedOffersContextValue = {
  savedIds: string[];
  savedOffers: Offer[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const SavedOffersContext = createContext<SavedOffersContextValue | null>(null);

export function SavedOffersProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { fetchApi } = useApi();
  const [savedOffers, setSavedOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!isSignedIn) {
      setSavedOffers([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchApi('/api/saved-offers');
      const data = await parseApiResponse<ApiOffer[]>(response);
      setSavedOffers(mapApiOffers(data));
    } catch (err) {
      setSavedOffers([]);
      setError(err instanceof Error ? err.message : 'Failed to load saved offers');
    } finally {
      setIsLoading(false);
    }
  }, [fetchApi, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    refetch();
  }, [isLoaded, isSignedIn, refetch]);

  const savedIds = useMemo(() => savedOffers.map((offer) => offer.id), [savedOffers]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSaved = useCallback(
    async (id: string) => {
      if (!isSignedIn) {
        router.push('/(auth)/sign-in' as Href);
        return;
      }

      const wasSaved = savedIds.includes(id);
      const previousOffers = savedOffers;

      if (wasSaved) {
        setSavedOffers((current) => current.filter((offer) => offer.id !== id));
      }

      try {
        const response = wasSaved
          ? await fetchApi(`/api/saved-offers/${encodeURIComponent(id)}`, { method: 'DELETE' })
          : await fetchApi(`/api/saved-offers/${encodeURIComponent(id)}`, { method: 'POST' });

        await parseApiResponse(response);

        if (!wasSaved) {
          await refetch();
        }
      } catch (err) {
        setSavedOffers(previousOffers);
        setError(err instanceof Error ? err.message : 'Failed to update saved offer');
      }
    },
    [fetchApi, isSignedIn, refetch, router, savedIds, savedOffers],
  );

  const value = useMemo(
    () => ({
      savedIds,
      savedOffers,
      isSaved,
      toggleSaved,
      isLoading,
      error,
      refetch,
    }),
    [savedIds, savedOffers, isSaved, toggleSaved, isLoading, error, refetch],
  );

  return <SavedOffersContext.Provider value={value}>{children}</SavedOffersContext.Provider>;
}

export function useSavedOffers() {
  const context = useContext(SavedOffersContext);
  if (!context) {
    throw new Error('useSavedOffers must be used within SavedOffersProvider');
  }
  return context;
}
