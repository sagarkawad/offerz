import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SellerFilterBar } from '@/components/seller/seller-filter-bar';
import { ShopCard } from '@/components/seller/shop-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useSellerFilters } from '@/contexts/seller-filter-context';
import { useMyShops } from '@/hooks/use-my-shops';

export default function SellerShopsScreen() {
  const router = useRouter();
  const { locationFilterId, categoryFilterId, isHydrated } = useSellerFilters();
  const { shops, isLoading, error, refetch } = useMyShops(
    locationFilterId,
    categoryFilterId,
    isHydrated,
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SellerFilterBar />

        {!isHydrated || isLoading ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">Could not load shops</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              {error}
            </ThemedText>
            <Pressable
              onPress={refetch}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Try again</ThemedText>
            </Pressable>
          </ThemedView>
        ) : shops.length === 0 ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">No shops yet</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              Create your first shop from the Add tab to start posting offers.
            </ThemedText>
            <Pressable
              onPress={() => router.push('/seller/create-shop' as Href)}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Create shop</ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <FlatList
            data={shops}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <ThemedText type="subtitle" style={styles.title}>
                Shops
              </ThemedText>
            }
            renderItem={({ item }) => (
              <ShopCard
                shop={item}
                onPress={() => router.push(`/seller/shops/${item.id}` as Href)}
              />
            )}
          />
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
  actionButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
