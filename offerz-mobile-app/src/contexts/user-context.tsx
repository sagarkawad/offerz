import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/expo';

import { useApi } from '@/hooks/use-api';
import type { ApiUser } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';

type UserContextValue = {
  user: ApiUser | null;
  role: ApiUser['role'] | null;
  isShopkeeper: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { fetchApi } = useApi();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!isSignedIn) {
      setUser(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await fetchApi('/api/users/me', { method: 'POST' });
      const response = await fetchApi('/api/users/me');
      const data = await parseApiResponse<ApiUser>(response);
      setUser(data);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : 'Failed to load user');
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

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isShopkeeper: user?.role === 'SHOPKEEPER',
      isLoading: !isLoaded || isLoading,
      error,
      refetch,
    }),
    [user, isLoaded, isLoading, error, refetch],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserRole() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserRole must be used within UserProvider');
  }
  return context;
}
