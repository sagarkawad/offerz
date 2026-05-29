import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/expo';

import { ThemedView } from '@/components/themed-view';
import { useUserRole } from '@/contexts/user-context';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isShopkeeper, isLoading } = useUserRole();

  if (!isLoaded || (isSignedIn && isLoading)) {
    return (
      <ThemedView style={styles.loading}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (isSignedIn && isShopkeeper) {
    return <Redirect href="/(seller-tabs)/shops" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
