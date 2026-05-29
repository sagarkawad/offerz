import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { authFormStyles as formStyles } from '@/components/auth-form-styles';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { ALL_CATEGORIES, ALL_LOCATIONS } from '@/contexts/seller-filter-context';
import { useApi } from '@/hooks/use-api';
import { useMyShops } from '@/hooks/use-my-shops';
import { useTheme } from '@/hooks/use-theme';
import type { ApiSellerOffer } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';

type CreateOfferFormProps = {
  onSuccess?: () => void;
  onCreateShopPress?: () => void;
  includeTabBarInset?: boolean;
};

export function CreateOfferForm({ onSuccess, onCreateShopPress, includeTabBarInset }: CreateOfferFormProps) {
  const router = useRouter();
  const theme = useTheme();
  const { fetchApi } = useApi();
  const { shops, isLoading: shopsLoading } = useMyShops(ALL_LOCATIONS, ALL_CATEGORIES, true);

  const [shopId, setShopId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shops.length === 1 && !shopId) {
      setShopId(shops[0].id);
    }
  }, [shopId, shops]);

  const inputStyle = [
    formStyles.input,
    {
      borderColor: theme.backgroundSelected,
      backgroundColor: theme.backgroundElement,
      color: theme.text,
    },
  ];

  const handleCreateShopPress = () => {
    if (onCreateShopPress) {
      onCreateShopPress();
    } else {
      router.replace('/seller/create-shop' as Href);
    }
  };

  const handleSave = async () => {
    if (!shopId || !title.trim() || !description.trim() || !discount.trim() || !validUntil) {
      setError('All fields are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetchApi(`/api/shops/${encodeURIComponent(shopId)}/offers`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          discount: discount.trim(),
          validUntil,
        }),
      });
      await parseApiResponse<ApiSellerOffer>(response);
      if (onSuccess) {
        onSuccess();
      } else {
        router.replace('/(seller-tabs)/shops' as Href);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create offer');
    } finally {
      setIsSaving(false);
    }
  };

  if (shopsLoading) {
    return (
      <ThemedView style={styles.centerState}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (shops.length === 0) {
    return (
      <ThemedView style={styles.centerState}>
        <ThemedText type="smallBold">Create a shop first</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.emptyHint}>
          You need at least one shop before posting an offer.
        </ThemedText>
        <Pressable
          onPress={handleCreateShopPress}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
          <ThemedText type="smallBold">Create shop</ThemedText>
        </Pressable>
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
      <ThemedText type="smallBold">Shop</ThemedText>
      <ThemedView style={styles.shopList}>
        {shops.map((item) => {
          const isSelected = item.id === shopId;
          return (
            <Pressable
              key={item.id}
              onPress={() => setShopId(item.id)}
              style={({ pressed }) => [
                styles.shopRow,
                isSelected && styles.shopRowSelected,
                pressed && styles.pressed,
              ]}>
              <ThemedText type="default">{item.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.locationLabel}
              </ThemedText>
            </Pressable>
          );
        })}
      </ThemedView>

      <ThemedText type="smallBold">Title</ThemedText>
      <TextInput value={title} onChangeText={setTitle} style={inputStyle} />

      <ThemedText type="smallBold">Description</ThemedText>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[inputStyle, styles.multiline]}
        multiline
      />

      <ThemedText type="smallBold">Discount</ThemedText>
      <TextInput
        value={discount}
        onChangeText={setDiscount}
        style={inputStyle}
        placeholder="20% off"
        placeholderTextColor={theme.textSecondary}
      />

      <ThemedText type="smallBold">Valid until (YYYY-MM-DD)</ThemedText>
      <TextInput
        value={validUntil}
        onChangeText={setValidUntil}
        style={inputStyle}
        placeholder="2026-12-31"
        placeholderTextColor={theme.textSecondary}
      />

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
        <ThemedText style={formStyles.buttonText}>{isSaving ? 'Creating…' : 'Create offer'}</ThemedText>
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
  shopList: {
    gap: Spacing.two,
    backgroundColor: 'transparent',
  },
  shopRow: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.half,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
  },
  shopRowSelected: {
    backgroundColor: 'rgba(60, 135, 247, 0.18)',
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
  actionButton: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
