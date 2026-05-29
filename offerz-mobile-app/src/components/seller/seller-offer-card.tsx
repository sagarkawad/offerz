import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { SellerOffer } from '@/types/shop';

type SellerOfferCardProps = {
  offer: SellerOffer;
  onPress: () => void;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SellerOfferCard({ offer, onPress }: SellerOfferCardProps) {
  const isExpired = offer.status === 'expired';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}, ${offer.discount}`}>
      <ThemedView type="backgroundElement" style={styles.cardInner}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerText}>
            <ThemedText type="smallBold">{offer.title}</ThemedText>
            {offer.categoryNames ? (
              <ThemedText type="small" themeColor="textSecondary">
                {offer.categoryNames}
              </ThemedText>
            ) : null}
          </ThemedView>
          <ThemedView style={styles.headerBadges}>
            <ThemedView type="backgroundSelected" style={styles.statusBadge}>
              <ThemedText type="smallBold" themeColor={isExpired ? 'textSecondary' : 'text'}>
                {isExpired ? 'Expired' : 'Active'}
              </ThemedText>
            </ThemedView>
            <ThemedView type="backgroundSelected" style={styles.statusBadge}>
              <ThemedText type="smallBold">{offer.isPublic ? 'Public' : 'Private'}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView type="backgroundSelected" style={styles.discountBadge}>
          <ThemedText type="smallBold">{offer.discount}</ThemedText>
        </ThemedView>

        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
          {offer.description}
        </ThemedText>

        <ThemedText type="small" themeColor="textSecondary">
          Valid until {formatDate(offer.validUntil)}
        </ThemedText>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginLeft: Spacing.two,
    backgroundColor: 'transparent',
  },
  headerText: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  statusBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
