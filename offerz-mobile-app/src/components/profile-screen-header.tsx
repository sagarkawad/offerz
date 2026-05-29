import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProfileScreenHeaderProps = {
  title: string;
};

export function ProfileScreenHeader({ title }: ProfileScreenHeaderProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.header}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <SymbolView
          name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
          size={22}
          tintColor={theme.text}
        />
      </Pressable>
      <ThemedText type="smallBold" style={styles.headerTitle}>
        {title}
      </ThemedText>
      <ThemedView style={styles.headerSpacer} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: Spacing.one,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 30,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
