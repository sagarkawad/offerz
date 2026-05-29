import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ShopStatusBadgesProps = {
  approved: boolean;
  isPublic: boolean;
};

export function ShopStatusBadges({ approved, isPublic }: ShopStatusBadgesProps) {
  return (
    <ThemedView style={styles.row}>
      {!approved ? (
        <ThemedView type="backgroundSelected" style={styles.badge}>
          <ThemedText type="smallBold">Pending approval</ThemedText>
        </ThemedView>
      ) : null}
      <ThemedView type="backgroundSelected" style={styles.badge}>
        <ThemedText type="smallBold">
          {isPublic ? (approved ? 'Public' : 'Public (awaiting approval)') : 'Private'}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one,
  },
});
