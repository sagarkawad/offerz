import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryPicker } from '@/components/offers/category-picker';
import { LocationBar } from '@/components/offers/location-bar';
import { OfferCard } from '@/components/offers/offer-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useCategory } from '@/contexts/category-context';
import { useLocation } from '@/contexts/location-context';
import { useSavedOffers } from '@/contexts/saved-offers-context';
import { useOffers } from '@/hooks/use-offers';

export default function OffersScreen() {
  const router = useRouter();
  const { isSaved, toggleSaved } = useSavedOffers();
  const { locationId, getLocationLabel, isLoading: locationLoading } = useLocation();
  const {
    categoryId,
    categories,
    setCategoryId,
    isHydrated,
    isLoading: categoryLoading,
    error: categoryError,
    refetchCategories,
  } = useCategory();
  const {
    offers,
    expandedToOtherLocations,
    isLoading: offersLoading,
    error: offersError,
    refetch,
  } = useOffers(locationId, categoryId);
  const [showPicker, setShowPicker] = useState(false);

  const showCategoryPicker = !categoryId || showPicker;
  const selectedCategory = categories.find((category) => category.id === categoryId);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LocationBar
          location={getLocationLabel(locationId)}
          onPress={() => router.push('/location')}
        />

        {!isHydrated ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : showCategoryPicker ? (
          <CategoryPicker
            mode="picker"
            categories={categories}
            selectedId={categoryId}
            isLoading={categoryLoading || locationLoading}
            error={categoryError}
            onRetry={refetchCategories}
            onSelect={async (id) => {
              await setCategoryId(id);
              setShowPicker(false);
            }}
          />
        ) : (
          <>
            {selectedCategory ? (
              <CategoryPicker
                mode="selected"
                categories={categories}
                selectedId={categoryId}
                onSelect={setCategoryId}
                onChangePress={() => setShowPicker(true)}
              />
            ) : null}

            {!selectedCategory ? (
              <ThemedView style={styles.centerState}>
                <ActivityIndicator />
              </ThemedView>
            ) : offersLoading ? (
              <ThemedView style={styles.centerState}>
                <ActivityIndicator />
              </ThemedView>
            ) : offersError ? (
              <ThemedView style={styles.centerState}>
                <ThemedText type="smallBold">Could not load offers</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
                  {offersError}
                </ThemedText>
                <Pressable
                  onPress={refetch}
                  style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
                  <ThemedText type="smallBold">Try again</ThemedText>
                </Pressable>
              </ThemedView>
            ) : offers.length === 0 ? (
              <ThemedView style={styles.centerState}>
                <ThemedText type="smallBold">No offers in this category yet</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
                  Try a different category or check back later.
                </ThemedText>
                <Pressable
                  onPress={() => setShowPicker(true)}
                  style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
                  <ThemedText type="smallBold">Change category</ThemedText>
                </Pressable>
              </ThemedView>
            ) : (
              <FlatList
                data={offers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <>
                    <ThemedText type="subtitle" style={styles.title}>
                      Offers
                    </ThemedText>
                    {expandedToOtherLocations ? (
                      <ThemedView type="backgroundSelected" style={styles.locationFallbackBanner}>
                        <ThemedText type="smallBold">No offers in {getLocationLabel(locationId)}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          Showing offers from other locations in this category.
                        </ThemedText>
                      </ThemedView>
                    ) : null}
                  </>
                }
                renderItem={({ item }) => (
                  <OfferCard
                    offer={item}
                    locationLabel={
                      expandedToOtherLocations ? getLocationLabel(item.locationId) : undefined
                    }
                    isSaved={isSaved(item.id)}
                    onToggleSave={() => toggleSaved(item.id)}
                  />
                )}
              />
            )}
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  title: {
    paddingBottom: Spacing.three,
  },
  locationFallbackBanner: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    paddingBottom: BottomTabInset,
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  emptyHint: {
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
