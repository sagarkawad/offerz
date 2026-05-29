import Constants from 'expo-constants';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title="About" />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView type="backgroundElement" style={styles.heroCard}>
            <ThemedText type="title" style={styles.appName}>
              Offerz
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Version {appVersion}
            </ThemedText>
          </ThemedView>

          <ThemedText type="default" style={styles.paragraph}>
            Offerz helps you discover deals and promotions from local shopkeepers in your area. Browse
            offers by location and category, and save the ones you want to revisit later.
          </ThemedText>

          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
            What you can do
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.listCard}>
            <ThemedText type="small" style={styles.listItem}>
              • Browse offers near your selected location
            </ThemedText>
            <ThemedText type="small" style={styles.listItem}>
              • Filter offers by category
            </ThemedText>
            <ThemedText type="small" style={styles.listItem}>
              • Save offers when signed in to sync across devices
            </ThemedText>
          </ThemedView>
        </ScrollView>
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
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  heroCard: {
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  appName: {
    textAlign: 'center',
  },
  paragraph: {
    lineHeight: 24,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  listItem: {
    lineHeight: 22,
  },
});
