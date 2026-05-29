import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authFormStyles as formStyles } from '@/components/auth-form-styles';
import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCategory } from '@/contexts/category-context';
import { useLocation } from '@/contexts/location-context';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import type { ApiShopSummary } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';

export default function CreateShopScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { fetchApi } = useApi();
  const { locations, isLoading: locationsLoading } = useLocation();
  const { categories, isLoading: categoriesLoading } = useCategory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locationId, setLocationId] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = locationsLoading || categoriesLoading;

  const inputStyle = [
    formStyles.input,
    {
      borderColor: theme.backgroundSelected,
      backgroundColor: theme.backgroundElement,
      color: theme.text,
    },
  ];

  const toggleCategory = (id: string) => {
    setCategoryIds((current) =>
      current.includes(id) ? current.filter((categoryId) => categoryId !== id) : [...current, id],
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !locationId || categoryIds.length === 0) {
      setError('Shop name, location, and at least one category are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetchApi('/api/shops', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          locationId,
          categoryIds,
        }),
      });
      await parseApiResponse<ApiShopSummary>(response);
      router.replace('/(seller-tabs)/shops' as Href);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create shop');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title="Create shop" />

        {isLoading ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : (
          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <ThemedText type="smallBold">Shop name</ThemedText>
            <TextInput value={name} onChangeText={setName} style={inputStyle} placeholder="Sunrise Bakery" placeholderTextColor={theme.textSecondary} />

            <ThemedText type="smallBold">Description (optional)</ThemedText>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[inputStyle, styles.multiline]}
              multiline
              placeholder="Tell buyers about your shop"
              placeholderTextColor={theme.textSecondary}
            />

            <ThemedText type="smallBold">Location</ThemedText>
            <FlatList
              data={locations}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.optionList}
              renderItem={({ item }) => {
                const isSelected = item.id === locationId;
                return (
                  <Pressable
                    onPress={() => setLocationId(item.id)}
                    style={({ pressed }) => [
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText type="default">{item.label}</ThemedText>
                  </Pressable>
                );
              }}
            />

            <ThemedText type="smallBold">Categories</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Select one or more categories that describe your shop.
            </ThemedText>
            <ThemedView style={styles.categoryList}>
              {categories.map((category) => {
                const isSelected = categoryIds.includes(category.id);
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => toggleCategory(category.id)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText type="small">{category.name}</ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>

            {error ? <ThemedText style={formStyles.error}>{error}</ThemedText> : null}

            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={({ pressed }) => [
                formStyles.button,
                { backgroundColor: '#0a7ea4' },
                pressed && formStyles.buttonPressed,
                isSaving && formStyles.buttonDisabled,
              ]}>
              <ThemedText style={formStyles.buttonText}>{isSaving ? 'Creating…' : 'Create shop'}</ThemedText>
            </Pressable>
          </ScrollView>
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
  form: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  optionList: {
    gap: Spacing.two,
  },
  optionRow: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
  },
  optionRowSelected: {
    backgroundColor: 'rgba(60, 135, 247, 0.18)',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  categoryChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
  },
  categoryChipSelected: {
    backgroundColor: 'rgba(60, 135, 247, 0.18)',
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});
