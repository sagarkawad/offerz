import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { ShopSummary } from '@/types/shop';

type ShopCardProps = {
  shop: ShopSummary;
  onPress: () => void;
};

export function ShopCard({ shop, onPress }: ShopCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${shop.name}, ${shop.locationLabel}`}>
      <ThemedView type="backgroundElement" style={styles.cardInner}>
        <ThemedView style={styles.header}>
          <ThemedText type="smallBold">{shop.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {shop.locationLabel}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsRow}>
          <ThemedView type="backgroundSelected" style={styles.statBadge}>
            <ThemedText type="smallBold">{shop.activeOfferCount} active</ThemedText>
          </ThemedView>
          <ThemedView type="backgroundSelected" style={styles.statBadge}>
            <ThemedText type="small" themeColor="textSecondary">
              {shop.expiredOfferCount} expired
            </ThemedText>
          </ThemedView>
          <ThemedText type="small" themeColor="textSecondary">
            {shop.offerCount} total offers
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
  },
  cardInner: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  statBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
