import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Category } from '@/lib/mappers';

type CategoryPickerProps = {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  onChangePress?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  mode: 'picker' | 'selected';
};

function categoryIcon(slug: string) {
  switch (slug) {
    case 'food':
      return { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' } as const;
    case 'retail':
      return { ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' } as const;
    case 'fashion':
      return { ios: 'tshirt.fill', android: 'checkroom', web: 'checkroom' } as const;
    case 'health':
      return { ios: 'heart.fill', android: 'favorite', web: 'favorite' } as const;
    case 'services':
      return { ios: 'wrench.and.screwdriver.fill', android: 'build', web: 'build' } as const;
    case 'entertainment':
      return { ios: 'ticket.fill', android: 'confirmation_number', web: 'confirmation_number' } as const;
    default:
      return { ios: 'square.grid.2x2.fill', android: 'category', web: 'category' } as const;
  }
}

export function CategoryPicker({
  categories,
  selectedId,
  onSelect,
  onChangePress,
  isLoading,
  error,
  onRetry,
  mode,
}: CategoryPickerProps) {
  const theme = useTheme();

  if (mode === 'selected' && selectedId) {
    const selectedName = categories.find((category) => category.id === selectedId)?.name;

    if (!selectedName) {
      return null;
    }

    return (
      <Pressable
        onPress={onChangePress}
        style={({ pressed }) => [styles.selectedBarContainer, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Category: ${selectedName}. Tap to change.`}>
        <ThemedView type="backgroundElement" style={styles.selectedBar}>
          <SymbolView
            name={{ ios: 'square.grid.2x2.fill', android: 'category', web: 'category' }}
            size={18}
            tintColor="#3c87f7"
          />
          <ThemedView style={styles.selectedTextGroup}>
            <ThemedText type="small" themeColor="textSecondary">
              Showing offers in
            </ThemedText>
            <ThemedText type="smallBold" numberOfLines={1}>
              {selectedName}
            </ThemedText>
          </ThemedView>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Change
          </ThemedText>
        </ThemedView>
      </Pressable>
    );
  }

  return (
    <ThemedView style={styles.pickerSection}>
      <ThemedText type="subtitle" style={styles.title}>
        Choose a category
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
        Select a category to see offers near you.
      </ThemedText>

      {isLoading ? (
        <ThemedView style={styles.centerState}>
          <ActivityIndicator />
        </ThemedView>
      ) : error ? (
        <ThemedView style={styles.centerState}>
          <ThemedText type="smallBold">Could not load categories</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.errorHint}>
            {error}
          </ThemedText>
          {onRetry && (
            <Pressable onPress={onRetry} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Try again</ThemedText>
            </Pressable>
          )}
        </ThemedView>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedId;

            return (
              <Pressable
                onPress={() => onSelect(item.id)}
                style={({ pressed }) => [
                  styles.categoryRow,
                  isSelected && styles.categoryRowSelected,
                  pressed && styles.pressed,
                ]}>
                <ThemedView type={isSelected ? 'backgroundSelected' : 'backgroundElement'} style={styles.iconWrap}>
                  <SymbolView
                    name={categoryIcon(item.slug)}
                    size={20}
                    tintColor={isSelected ? '#3c87f7' : theme.textSecondary}
                  />
                </ThemedView>
                <ThemedView style={styles.categoryText}>
                  <ThemedText type="default">{item.name}</ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pickerSection: {
    flex: 1,
  },
  title: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.one,
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
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'transparent',
  },
  categoryRowSelected: {
    backgroundColor: 'rgba(60, 135, 247, 0.1)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  selectedBarContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  selectedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  selectedTextGroup: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
