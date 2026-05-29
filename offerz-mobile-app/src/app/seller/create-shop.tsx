import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreateShopForm } from '@/components/seller/create-shop-form';
import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { ThemedView } from '@/components/themed-view';

export default function CreateShopScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title="Create shop" />
        <CreateShopForm />
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
});
