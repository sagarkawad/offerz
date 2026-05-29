import { type Href, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';

import { OfferCard } from '@/components/offers/offer-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useSavedOffers } from '@/contexts/saved-offers-context';

export default function SavedScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { savedOffers, isSaved, toggleSaved, isLoading, error, refetch } = useSavedOffers();

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="subtitle" style={styles.title}>
          Saved
        </ThemedText>

        {!isSignedIn ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="smallBold">Sign in to save offers</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              Browse the Offers tab and sign in to bookmark deals you like.
            </ThemedText>
            <Pressable
              onPress={() => router.push('/(auth)/sign-in' as Href)}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Sign in</ThemedText>
            </Pressable>
          </ThemedView>
        ) : isLoading && savedOffers.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ActivityIndicator />
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="smallBold">Could not load saved offers</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              {error}
            </ThemedText>
            <Pressable
              onPress={refetch}
              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Try again</ThemedText>
            </Pressable>
          </ThemedView>
        ) : savedOffers.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="smallBold">No saved offers yet</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              Browse the Offers tab and tap the bookmark icon to save deals you like.
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={savedOffers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <OfferCard
                offer={item}
                isSaved={isSaved(item.id)}
                onToggleSave={() => toggleSaved(item.id)}
              />
            )}
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
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  emptyState: {
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
});
