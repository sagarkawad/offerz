import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LocationBarProps = {
  location: string;
  onPress?: () => void;
};

export function LocationBar({ location, onPress }: LocationBarProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Current location: ${location}. Tap to change.`}>
      <ThemedView type="backgroundElement" style={styles.bar}>
        <SymbolView
          name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
          size={18}
          tintColor="#3c87f7"
        />
        <ThemedView style={styles.textGroup}>
          <ThemedText type="small" themeColor="textSecondary">
            Showing offers near
          </ThemedText>
          <ThemedText type="smallBold" numberOfLines={1}>
            {location}
          </ThemedText>
        </ThemedView>
        <SymbolView
          name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
          size={16}
          tintColor={theme.textSecondary}
        />
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  textGroup: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
