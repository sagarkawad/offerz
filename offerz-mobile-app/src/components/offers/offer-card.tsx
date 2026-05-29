import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Offer } from '@/types/offer';

type OfferCardProps = {
  offer: Offer;
  locationLabel?: string;
  isSaved: boolean;
  onToggleSave: () => void;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function OfferCard({ offer, locationLabel, isSaved, onToggleSave }: OfferCardProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerText}>
          <ThemedText type="small" themeColor="textSecondary">
            {offer.shopName}
            {locationLabel ? ` · ${locationLabel}` : ''}
          </ThemedText>
          <ThemedText type="smallBold">{offer.title}</ThemedText>
        </ThemedView>
        <Pressable
          onPress={onToggleSave}
          style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save offer'}>
          <SymbolView
            name={{ ios: isSaved ? 'bookmark.fill' : 'bookmark', android: 'bookmark', web: 'bookmark' }}
            size={22}
            tintColor={isSaved ? '#3c87f7' : theme.textSecondary}
          />
        </Pressable>
      </ThemedView>

      <ThemedView type="backgroundSelected" style={styles.discountBadge}>
        <ThemedText type="smallBold">{offer.discount}</ThemedText>
      </ThemedView>

      <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
        {offer.description}
      </ThemedText>

      <ThemedText type="small" themeColor="textSecondary">
        Valid until {formatDate(offer.validUntil)}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
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
  headerText: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  saveButton: {
    padding: Spacing.one,
    marginLeft: Spacing.two,
  },
  pressed: {
    opacity: 0.6,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
  description: {
    lineHeight: 20,
  },
});
