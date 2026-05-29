import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { LocationBar } from '@/components/offers/location-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSellerFilters } from '@/contexts/seller-filter-context';

export function SellerFilterBar() {
  const router = useRouter();
  const {
    getLocationFilterLabel,
    getCategoryFilterLabel,
    showLocationFilter,
    showCategoryFilter,
    shopLocations,
    shopCategories,
  } = useSellerFilters();

  return (
    <ThemedView style={styles.container}>
      {showLocationFilter ? (
        <LocationBar
          location={getLocationFilterLabel()}
          subtitle="Showing shops in"
          onPress={() => router.push('/seller/location')}
        />
      ) : shopLocations.length === 1 ? (
        <ThemedView style={styles.singleFilterBar}>
          <ThemedText type="small" themeColor="textSecondary">
            Showing shops in
          </ThemedText>
          <ThemedText type="smallBold">{getLocationFilterLabel()}</ThemedText>
        </ThemedView>
      ) : null}

      {showCategoryFilter ? (
        <Pressable
          onPress={() => router.push('/seller/category')}
          style={({ pressed }) => [styles.categoryBarContainer, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Category filter: ${getCategoryFilterLabel()}. Tap to change.`}>
          <ThemedView type="backgroundElement" style={styles.categoryBar}>
            <ThemedView style={styles.categoryTextGroup}>
              <ThemedText type="small" themeColor="textSecondary">
                Showing shops in
              </ThemedText>
              <ThemedText type="smallBold" numberOfLines={1}>
                {getCategoryFilterLabel()}
              </ThemedText>
            </ThemedView>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Change
            </ThemedText>
          </ThemedView>
        </Pressable>
      ) : shopCategories.length === 1 ? (
        <ThemedView style={styles.singleFilterBar}>
          <ThemedText type="small" themeColor="textSecondary">
            Showing shops in
          </ThemedText>
          <ThemedText type="smallBold">{getCategoryFilterLabel()}</ThemedText>
        </ThemedView>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  singleFilterBar: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  categoryBarContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  categoryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  categoryTextGroup: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
