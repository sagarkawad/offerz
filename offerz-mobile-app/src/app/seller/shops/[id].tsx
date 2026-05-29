import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { SegmentControl } from '@/components/seller/segment-control';
import { SellerOfferCard } from '@/components/seller/seller-offer-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ALL_CATEGORIES, ALL_LOCATIONS } from '@/contexts/seller-filter-context';
import { useMyShops } from '@/hooks/use-my-shops';
import { type OfferStatusFilter, useShopOffers } from '@/hooks/use-shop-offers';

const STATUS_OPTIONS: { id: OfferStatusFilter; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'expired', label: 'Expired' },
  { id: 'all', label: 'All' },
];

export default function SellerShopDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<OfferStatusFilter>('active');
  const { shops, isLoading: shopsLoading } = useMyShops(ALL_LOCATIONS, ALL_CATEGORIES, Boolean(id));
  const { offers, isLoading: offersLoading, error, refetch } = useShopOffers(id ?? '', status);
  const shop = shops.find((item) => item.id === id);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title={shop?.name ?? 'Shop'} />

        {shopsLoading && !shop ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : (
          <>
            <ThemedView style={styles.header}>
              <ThemedText type="small" themeColor="textSecondary">
                {shop?.locationLabel ?? 'Shop details'}
              </ThemedText>
              {shop ? (
                <ThemedText type="small" themeColor="textSecondary">
                  {shop.activeOfferCount} active · {shop.expiredOfferCount} expired
                </ThemedText>
              ) : null}
            </ThemedView>

            <SegmentControl options={STATUS_OPTIONS} value={status} onChange={setStatus} />

            {offersLoading ? (
              <ThemedView style={styles.centerState}>
                <ActivityIndicator />
              </ThemedView>
            ) : error ? (
              <ThemedView style={styles.centerState}>
                <ThemedText type="smallBold">Could not load offers</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
                  {error}
                </ThemedText>
                <Pressable onPress={refetch} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                  <ThemedText type="smallBold">Try again</ThemedText>
                </Pressable>
              </ThemedView>
            ) : offers.length === 0 ? (
              <ThemedView style={styles.centerState}>
                <ThemedText type="smallBold">No offers in this view</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
                  Create a new offer from the Add tab or switch filters above.
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/seller/create-offer' as Href)}
                  style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                  <ThemedText type="smallBold">Create offer</ThemedText>
                </Pressable>
              </ThemedView>
            ) : (
              <FlatList
                data={offers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                  <SellerOfferCard
                    offer={item}
                    onPress={() =>
                      router.push(`/seller/shops/${id}/edit-offer/${item.id}` as Href)
                    }
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
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
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
