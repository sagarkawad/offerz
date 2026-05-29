import { useAuth } from '@clerk/expo';
import { useCallback, useRef } from 'react';

import { apiFetch } from '@/lib/api';

export function useApi() {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const fetchApi = useCallback(
    (path: string, options?: RequestInit) =>
      apiFetch(path, () => getTokenRef.current(), options),
    [],
  );

  return { fetchApi, getToken };
}
