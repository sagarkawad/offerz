import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthSync } from '@/components/auth-sync';
import { CategoryProvider } from '@/contexts/category-context';
import { LocationProvider } from '@/contexts/location-context';
import { SavedOffersProvider } from '@/contexts/saved-offers-context';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file');
}

const clerkPublishableKey: string = publishableKey;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthSync />
        <LocationProvider>
          <CategoryProvider>
            <SavedOffersProvider>
              <AnimatedSplashOverlay />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="location" />
              </Stack>
            </SavedOffersProvider>
          </CategoryProvider>
        </LocationProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
