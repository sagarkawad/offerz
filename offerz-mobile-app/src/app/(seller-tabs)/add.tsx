import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateOfferForm } from '@/components/seller/create-offer-form';
import { CreateShopForm } from '@/components/seller/create-shop-form';
import { SegmentControl } from '@/components/seller/segment-control';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type AddType = 'shop' | 'offer';

const ADD_OPTIONS: { id: AddType; label: string }[] = [
  { id: 'shop', label: 'Shop' },
  { id: 'offer', label: 'Offer' },
];

export default function SellerAddScreen() {
  const router = useRouter();
  const [addType, setAddType] = useState<AddType>('shop');

  const handleSuccess = () => {
    router.replace('/(seller-tabs)/shops' as Href);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="subtitle" style={styles.title}>
          Add
        </ThemedText>

        <SegmentControl options={ADD_OPTIONS} value={addType} onChange={setAddType} />

        <ThemedView style={styles.formArea}>
          {addType === 'shop' ? (
            <CreateShopForm onSuccess={handleSuccess} includeTabBarInset />
          ) : (
            <CreateOfferForm
              onSuccess={handleSuccess}
              onCreateShopPress={() => setAddType('shop')}
              includeTabBarInset
            />
          )}
        </ThemedView>
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
  formArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
