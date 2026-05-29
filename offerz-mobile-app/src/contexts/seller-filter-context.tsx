import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ALL_CATEGORIES, ALL_LOCATIONS } from '@/contexts/seller-filter-constants';
import { useUserRole } from '@/contexts/user-context';
import { useMyShops } from '@/hooks/use-my-shops';
import { getUniqueShopCategories } from '@/lib/shop-categories';
import { getUniqueShopLocations, type ShopLocation } from '@/lib/shop-locations';
import type { ShopCategory } from '@/types/shop';

export { ALL_CATEGORIES, ALL_LOCATIONS } from '@/contexts/seller-filter-constants';

const LOCATION_STORAGE_KEY = '@offerz/seller-location-filter';
const CATEGORY_STORAGE_KEY = '@offerz/seller-category-filter';

type SellerFilterContextValue = {
  locationFilterId: string;
  categoryFilterId: string;
  shopLocations: ShopLocation[];
  shopCategories: ShopCategory[];
  shopFiltersLoading: boolean;
  setLocationFilterId: (id: string) => Promise<void>;
  setCategoryFilterId: (id: string) => Promise<void>;
  getLocationFilterLabel: () => string;
  getCategoryFilterLabel: () => string;
  isHydrated: boolean;
  showLocationFilter: boolean;
  showCategoryFilter: boolean;
};

const SellerFilterContext = createContext<SellerFilterContextValue | null>(null);

async function readStoredValue(key: string, fallback: string): Promise<string> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

async function writeStoredValue(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Keep in-memory state if native storage is unavailable.
  }
}

export function SellerFilterProvider({ children }: { children: React.ReactNode }) {
  const { isShopkeeper } = useUserRole();
  const { shops, isLoading: shopFiltersLoading } = useMyShops(
    ALL_LOCATIONS,
    ALL_CATEGORIES,
    isShopkeeper,
  );
  const shopLocations = useMemo(() => getUniqueShopLocations(shops), [shops]);
  const shopCategories = useMemo(() => getUniqueShopCategories(shops), [shops]);
  const showLocationFilter = shopLocations.length > 1;
  const showCategoryFilter = shopCategories.length > 1;

  const [locationFilterId, setLocationFilterIdState] = useState(ALL_LOCATIONS);
  const [categoryFilterId, setCategoryFilterIdState] = useState(ALL_CATEGORIES);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    Promise.all([
      readStoredValue(LOCATION_STORAGE_KEY, ALL_LOCATIONS),
      readStoredValue(CATEGORY_STORAGE_KEY, ALL_CATEGORIES),
    ]).then(([storedLocation, storedCategory]) => {
      setLocationFilterIdState(storedLocation);
      setCategoryFilterIdState(storedCategory);
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!isHydrated || locationFilterId === ALL_LOCATIONS) {
      return;
    }

    const isValid = shopLocations.some((location) => location.id === locationFilterId);
    if (!isValid) {
      setLocationFilterIdState(ALL_LOCATIONS);
      writeStoredValue(LOCATION_STORAGE_KEY, ALL_LOCATIONS);
    }
  }, [isHydrated, locationFilterId, shopLocations]);

  useEffect(() => {
    if (!isHydrated || categoryFilterId === ALL_CATEGORIES) {
      return;
    }

    const isValid = shopCategories.some((category) => category.id === categoryFilterId);
    if (!isValid) {
      setCategoryFilterIdState(ALL_CATEGORIES);
      writeStoredValue(CATEGORY_STORAGE_KEY, ALL_CATEGORIES);
    }
  }, [isHydrated, categoryFilterId, shopCategories]);

  const setLocationFilterId = useCallback(async (id: string) => {
    setLocationFilterIdState(id);
    await writeStoredValue(LOCATION_STORAGE_KEY, id);
  }, []);

  const setCategoryFilterId = useCallback(async (id: string) => {
    setCategoryFilterIdState(id);
    await writeStoredValue(CATEGORY_STORAGE_KEY, id);
  }, []);

  const getLocationFilterLabel = useCallback(() => {
    if (shopLocations.length === 1) {
      return shopLocations[0].label;
    }
    if (locationFilterId === ALL_LOCATIONS) {
      return 'All locations';
    }
    return shopLocations.find((location) => location.id === locationFilterId)?.label ?? 'All locations';
  }, [locationFilterId, shopLocations]);

  const getCategoryFilterLabel = useCallback(() => {
    if (shopCategories.length === 1) {
      return shopCategories[0].name;
    }
    if (categoryFilterId === ALL_CATEGORIES) {
      return 'All categories';
    }
    return shopCategories.find((category) => category.id === categoryFilterId)?.name ?? 'All categories';
  }, [categoryFilterId, shopCategories]);

  const value = useMemo(
    () => ({
      locationFilterId,
      categoryFilterId,
      shopLocations,
      shopCategories,
      shopFiltersLoading,
      setLocationFilterId,
      setCategoryFilterId,
      getLocationFilterLabel,
      getCategoryFilterLabel,
      isHydrated,
      showLocationFilter,
      showCategoryFilter,
    }),
    [
      locationFilterId,
      categoryFilterId,
      shopLocations,
      shopCategories,
      shopFiltersLoading,
      setLocationFilterId,
      setCategoryFilterId,
      getLocationFilterLabel,
      getCategoryFilterLabel,
      isHydrated,
      showLocationFilter,
      showCategoryFilter,
    ],
  );

  return <SellerFilterContext.Provider value={value}>{children}</SellerFilterContext.Provider>;
}

export function useSellerFilters() {
  const context = useContext(SellerFilterContext);
  if (!context) {
    throw new Error('useSellerFilters must be used within SellerFilterProvider');
  }
  return context;
}
