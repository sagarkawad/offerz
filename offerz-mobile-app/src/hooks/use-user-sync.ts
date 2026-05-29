import { useAuth } from '@clerk/expo';
import { useEffect, useRef } from 'react';

import { useApi } from '@/hooks/use-api';
import type { ApiUser } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';

export function useUserSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const { fetchApi } = useApi();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      syncedRef.current = false;
      return;
    }

    if (syncedRef.current) {
      return;
    }

    let cancelled = false;

    async function syncUser() {
      try {
        const response = await fetchApi('/api/users/me', { method: 'POST' });
        await parseApiResponse<ApiUser>(response);
        if (!cancelled) {
          syncedRef.current = true;
        }
      } catch {
        if (!cancelled) {
          syncedRef.current = false;
        }
      }
    }

    syncUser();

    return () => {
      cancelled = true;
    };
  }, [fetchApi, isLoaded, isSignedIn]);
}
