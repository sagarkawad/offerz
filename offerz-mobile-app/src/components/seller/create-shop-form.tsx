import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, TextInput } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { authFormStyles as formStyles } from '@/components/auth-form-styles';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useCategory } from '@/contexts/category-context';
import { useLocation } from '@/contexts/location-context';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import type { ApiShopSummary } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';

type CreateShopFormProps = {
  onSuccess?: () => void;
  includeTabBarInset?: boolean;
};

export function CreateShopForm({ onSuccess, includeTabBarInset }: CreateShopFormProps) {
  const router = useRouter();
  const theme = useTheme();
  const { fetchApi } = useApi();
  const { locations, isLoading: locationsLoading } = useLocation();
  const { categories, isLoading: categoriesLoading } = useCategory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locationId, setLocationId] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
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
          isPublic,
        }),
      });
      await parseApiResponse<ApiShopSummary>(response);
      if (onSuccess) {
        onSuccess();
      } else {
        router.replace('/(seller-tabs)/shops' as Href);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create shop');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.centerState}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.form,
        includeTabBarInset && { paddingBottom: BottomTabInset + Spacing.four },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <ThemedText type="smallBold">Shop name</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        style={inputStyle}
        placeholder="Sunrise Bakery"
        placeholderTextColor={theme.textSecondary}
      />

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
      <ThemedView style={styles.optionList}>
        {locations.map((item) => {
          const isSelected = item.id === locationId;
          return (
            <Pressable
              key={item.id}
              onPress={() => setLocationId(item.id)}
              style={({ pressed }) => [
                styles.optionRow,
                isSelected && styles.optionRowSelected,
                pressed && styles.pressed,
              ]}>
              <ThemedText type="default">{item.label}</ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>

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

      <ThemedView style={styles.switchRow}>
        <ThemedView style={styles.switchText}>
          <ThemedText type="smallBold">Make shop public</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Buyers will see this shop once an admin approves it.
          </ThemedText>
        </ThemedView>
        <Switch value={isPublic} onValueChange={setIsPublic} />
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
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  form: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  optionList: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    backgroundColor: 'transparent',
  },
  switchText: {
    flex: 1,
    gap: Spacing.half,
    backgroundColor: 'transparent',
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
