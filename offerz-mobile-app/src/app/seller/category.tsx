import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { ALL_CATEGORIES, useSellerFilters } from '@/contexts/seller-filter-context';
import { useTheme } from '@/hooks/use-theme';

export default function SellerCategoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const {
    categoryFilterId,
    setCategoryFilterId,
    shopCategories,
    shopFiltersLoading,
  } = useSellerFilters();

  const handleSelect = async (id: string) => {
    await setCategoryFilterId(id);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title="Filter by category" />

        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Choose a category assigned to your shops, or view all of them.
        </ThemedText>

        {shopFiltersLoading ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : shopCategories.length === 0 ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">No shop categories yet</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
              Add categories when creating a shop.
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={[{ id: ALL_CATEGORIES, name: 'All categories', slug: 'all' }, ...shopCategories]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isSelected = item.id === categoryFilterId;

              return (
                <Pressable
                  onPress={() => handleSelect(item.id)}
                  style={({ pressed }) => [styles.row, isSelected && styles.rowSelected, pressed && styles.pressed]}>
                  <ThemedText type="default">{item.name}</ThemedText>
                  {isSelected ? (
                    <SymbolView
                      name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                      size={22}
                      tintColor="#3c87f7"
                    />
                  ) : (
                    <SymbolView
                      name={{ ios: 'square.grid.2x2', android: 'category', web: 'category' }}
                      size={20}
                      tintColor={theme.textSecondary}
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
  subtitle: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'transparent',
  },
  rowSelected: {
    backgroundColor: 'rgba(60, 135, 247, 0.1)',
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  emptyHint: {
    textAlign: 'center',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
