import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useCategories } from '@/hooks/use-categories';
import type { Category } from '@/lib/mappers';

const STORAGE_KEY = '@offerz/selected-category';

type CategoryContextValue = {
  categoryId: string;
  categories: Category[];
  setCategoryId: (id: string) => Promise<void>;
  clearCategoryId: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  getCategoryName: (id: string) => string;
  refetchCategories: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextValue | null>(null);

async function readCategoryId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

async function writeCategoryId(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Keep in-memory state if native storage is unavailable.
  }
}

async function removeCategoryId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Keep in-memory state if native storage is unavailable.
  }
}

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const { categories, isLoading: categoriesLoading, error, refetch } = useCategories();
  const [categoryId, setCategoryIdState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readCategoryId().then((storedId) => {
      if (storedId) {
        setCategoryIdState(storedId);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (categoriesLoading || categories.length === 0 || !categoryId) {
      return;
    }

    const isValid = categories.some((category) => category.id === categoryId);
    if (!isValid) {
      setCategoryIdState('');
      removeCategoryId();
    }
  }, [categoryId, categories, categoriesLoading]);

  const setCategoryId = useCallback(async (id: string) => {
    setCategoryIdState(id);
    await writeCategoryId(id);
  }, []);

  const clearCategoryId = useCallback(async () => {
    setCategoryIdState('');
    await removeCategoryId();
  }, []);

  const getCategoryName = useCallback(
    (id: string) => {
      return categories.find((category) => category.id === id)?.name ?? id;
    },
    [categories],
  );

  const value = useMemo(
    () => ({
      categoryId,
      categories,
      setCategoryId,
      clearCategoryId,
      isLoading: isLoading || categoriesLoading,
      error,
      getCategoryName,
      refetchCategories: refetch,
    }),
    [
      categoryId,
      categories,
      setCategoryId,
      clearCategoryId,
      isLoading,
      categoriesLoading,
      error,
      getCategoryName,
      refetch,
    ],
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within CategoryProvider');
  }
  return context;
}
