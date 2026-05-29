import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_LOCATION_ID } from '@/constants/locations';
import { useLocations } from '@/hooks/use-locations';
import type { Location } from '@/lib/mappers';

const STORAGE_KEY = '@offerz/selected-location';

type LocationContextValue = {
  locationId: string;
  locations: Location[];
  setLocationId: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  getLocationLabel: (id: string) => string;
  refetchLocations: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

async function readLocationId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

async function writeLocationId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Keep in-memory state if native storage is unavailable.
  }
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { locations, isLoading: locationsLoading, error, refetch } = useLocations();
  const [locationId, setLocationIdState] = useState(DEFAULT_LOCATION_ID);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readLocationId().then((storedId) => {
      if (storedId) {
        setLocationIdState(storedId);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (locationsLoading || locations.length === 0) {
      return;
    }

    const isValid = locations.some((location) => location.id === locationId);
    if (!isValid) {
      setLocationIdState(locations[0].id);
      writeLocationId(locations[0].id);
    }
  }, [locationId, locations, locationsLoading]);

  const setLocationId = useCallback(async (id: string) => {
    setLocationIdState(id);
    await writeLocationId(id);
  }, []);

  const getLocationLabel = useCallback(
    (id: string) => {
      return locations.find((location) => location.id === id)?.label ?? id;
    },
    [locations],
  );

  const value = useMemo(
    () => ({
      locationId,
      locations,
      setLocationId,
      isLoading: isLoading || locationsLoading,
      error,
      getLocationLabel,
      refetchLocations: refetch,
    }),
    [locationId, locations, setLocationId, isLoading, locationsLoading, error, getLocationLabel, refetch],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
