import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authFormStyles as formStyles } from '@/components/auth-form-styles';
import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useShopOffers } from '@/hooks/use-shop-offers';
import { useTheme } from '@/hooks/use-theme';
import type { ApiSellerOffer } from '@/lib/api-types';
import { parseApiResponse } from '@/lib/api';

export default function EditOfferScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { fetchApi } = useApi();
  const { id, offerId } = useLocalSearchParams<{ id: string; offerId: string }>();
  const { offers, isLoading } = useShopOffers(id ?? '', 'all');
  const offer = offers.find((item) => item.id === offerId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!offer) {
      return;
    }

    setTitle(offer.title);
    setDescription(offer.description);
    setDiscount(offer.discount);
    setValidUntil(offer.validUntil.slice(0, 10));
  }, [offer]);

  const inputStyle = [
    formStyles.input,
    {
      borderColor: theme.backgroundSelected,
      backgroundColor: theme.backgroundElement,
      color: theme.text,
    },
  ];

  const handleSave = async () => {
    if (!id || !offerId) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetchApi(`/api/shops/${encodeURIComponent(id)}/offers/${encodeURIComponent(offerId)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          discount: discount.trim(),
          validUntil,
        }),
      });
      await parseApiResponse<ApiSellerOffer>(response);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update offer');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title="Edit offer" />

        {isLoading && !offer ? (
          <ThemedView style={styles.centerState}>
            <ActivityIndicator />
          </ThemedView>
        ) : !offer ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">Offer not found</ThemedText>
          </ThemedView>
        ) : (
          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
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
            <TextInput value={discount} onChangeText={setDiscount} style={inputStyle} />

            <ThemedText type="smallBold">Valid until (YYYY-MM-DD)</ThemedText>
            <TextInput value={validUntil} onChangeText={setValidUntil} style={inputStyle} />

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
              <ThemedText style={formStyles.buttonText}>{isSaving ? 'Saving…' : 'Save offer'}</ThemedText>
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
