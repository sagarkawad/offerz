import { type Href, useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const SUPPORT_EMAIL = 'support@offerz.app';

const faqs = [
  {
    question: 'How do I change my location?',
    answer:
      'Tap the location bar at the top of the Offers tab, then pick the area where you want to browse deals.',
  },
  {
    question: 'How do I filter by category?',
    answer: 'Use the category picker on the Offers tab to narrow the list to a specific type of deal.',
  },
  {
    question: 'How do saved offers work?',
    answer:
      'Tap the bookmark icon on an offer card to save it. Sign in to keep your saved offers synced to your account.',
  },
  {
    question: 'Why do I need to sign in?',
    answer:
      'Signing in lets Offerz sync your saved offers and profile across sessions. Browsing offers works without an account.',
  },
];

export default function HelpScreen() {
  const router = useRouter();

  const openEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Offerz%20support`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title="Help" />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.intro}>
            Quick answers to common questions. Need more help? Contact us below.
          </ThemedText>

          {faqs.map((faq) => (
            <ThemedView key={faq.question} type="backgroundElement" style={styles.faqCard}>
              <ThemedText type="smallBold">{faq.question}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.faqAnswer}>
                {faq.answer}
              </ThemedText>
            </ThemedView>
          ))}

          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
            Contact
          </ThemedText>
          <Pressable onPress={openEmail} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundElement" style={styles.contactRow}>
              <ThemedText type="default">Email support</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {SUPPORT_EMAIL}
              </ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable
            onPress={() => router.push('/location' as Href)}
            style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundElement" style={styles.contactRow}>
              <ThemedText type="default">Change location</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Open location picker
              </ThemedText>
            </ThemedView>
          </Pressable>
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
  intro: {
    lineHeight: 20,
  },
  faqCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  faqAnswer: {
    lineHeight: 20,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.one,
  },
  contactRow: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.7,
  },
});
