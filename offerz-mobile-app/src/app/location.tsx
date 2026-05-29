import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useLocation } from '@/contexts/location-context';
import { useTheme } from '@/hooks/use-theme';

export default function LocationScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { locationId, locations, setLocationId, isLoading, error, refetchLocations } = useLocation();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
            Choose location
          </ThemedText>
          <ThemedView style={styles.headerSpacer} />
        </ThemedView>

        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Select an area to see nearby offers from shopkeepers.
        </ThemedText>

        {isLoading ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">Could not load locations</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.errorHint}>
              {error}
            </ThemedText>
            <Pressable onPress={refetchLocations} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Try again</ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <FlatList
            data={locations}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item.id === locationId;

              return (
                <Pressable
                  onPress={async () => {
                    await setLocationId(item.id);
                    router.back();
                  }}
                  style={({ pressed }) => [
                    styles.locationRow,
                    isSelected && styles.locationRowSelected,
                    pressed && styles.pressed,
                  ]}>
                  <ThemedView type={isSelected ? 'backgroundSelected' : 'backgroundElement'} style={styles.iconWrap}>
                    <SymbolView
                      name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
                      size={20}
                      tintColor={isSelected ? '#3c87f7' : theme.textSecondary}
                    />
                  </ThemedView>
                  <ThemedView style={styles.locationText}>
                    <ThemedText type="default">{item.label}</ThemedText>
                    {isSelected && (
                      <ThemedText type="small" themeColor="textSecondary">
                        Current location
                      </ThemedText>
                    )}
                  </ThemedView>
                  {isSelected && (
                    <SymbolView
                      name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                      size={22}
                      tintColor="#3c87f7"
                    />
                  )}
                </Pressable>
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
  subtitle: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  errorHint: {
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'transparent',
  },
  locationRowSelected: {
    backgroundColor: 'rgba(60, 135, 247, 0.1)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
