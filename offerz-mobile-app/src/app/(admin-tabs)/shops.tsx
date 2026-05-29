import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SegmentControl } from '@/components/seller/segment-control';
import { ShopStatusBadges } from '@/components/seller/shop-status-badges';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { type AdminShopFilter, useAdminShops } from '@/hooks/use-admin-shops';
import { useApi } from '@/hooks/use-api';
import type { ApiAdminShop } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';

const FILTER_OPTIONS: { id: AdminShopFilter; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'all', label: 'All' },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminShopsScreen() {
  const { fetchApi } = useApi();
  const [filter, setFilter] = useState<AdminShopFilter>('pending');
  const [updatingShopId, setUpdatingShopId] = useState<string | null>(null);
  const { shops, isLoading, error, refetch } = useAdminShops(filter);

  const handleApproval = async (shopId: string, approved: boolean) => {
    setUpdatingShopId(shopId);

    try {
      const response = await fetchApi(`/api/admin/shops/${encodeURIComponent(shopId)}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approved }),
      });
      await parseApiResponse<ApiAdminShop>(response);
      await refetch();
    } catch {
      // refetch keeps list consistent; errors surface on next load if needed
      await refetch();
    } finally {
      setUpdatingShopId(null);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="subtitle" style={styles.title}>
          Shop approvals
        </ThemedText>

        <SegmentControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

        {isLoading ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">Could not load shops</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              {error}
            </ThemedText>
            <Pressable onPress={refetch} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Try again</ThemedText>
            </Pressable>
          </ThemedView>
        ) : shops.length === 0 ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">No shops in this view</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              {filter === 'pending'
                ? 'There are no shops waiting for approval.'
                : 'Switch filters to see other shops.'}
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={shops}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isUpdating = updatingShopId === item.id;

              return (
                <ThemedView type="backgroundElement" style={styles.card}>
                  <ThemedView style={styles.cardHeader}>
                    <ThemedText type="smallBold">{item.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.locationLabel}
                    </ThemedText>
                  </ThemedView>

                  <ShopStatusBadges approved={item.approved} isPublic={item.isPublic} />

                  <ThemedText type="small" themeColor="textSecondary">
                    Owner: {item.ownerId}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Submitted {formatDate(item.createdAt)}
                  </ThemedText>

                  <ThemedView style={styles.actions}>
                    {!item.approved ? (
                      <Pressable
                        onPress={() => handleApproval(item.id, true)}
                        disabled={isUpdating}
                        style={({ pressed }) => [
                          styles.approveButton,
                          pressed && styles.pressed,
                          isUpdating && styles.disabled,
                        ]}>
                        <ThemedText style={styles.approveButtonText}>
                          {isUpdating ? 'Updating…' : 'Approve'}
                        </ThemedText>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => handleApproval(item.id, false)}
                        disabled={isUpdating}
                        style={({ pressed }) => [
                          styles.rejectButton,
                          pressed && styles.pressed,
                          isUpdating && styles.disabled,
                        ]}>
                        <ThemedText type="smallBold">
                          {isUpdating ? 'Updating…' : 'Revoke approval'}
                        </ThemedText>
                      </Pressable>
                    )}
                  </ThemedView>
                </ThemedView>
              );
            }}
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
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  approveButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#0a7ea4',
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  rejectButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(127, 127, 127, 0.18)',
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
  disabled: {
    opacity: 0.5,
  },
});
