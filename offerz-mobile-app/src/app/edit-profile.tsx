import { useAuth, useUser } from '@clerk/expo';
import { type Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authFormStyles as formStyles } from '@/components/auth-form-styles';
import { ProfileScreenHeader } from '@/components/profile-screen-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function EditProfileScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const theme = useTheme();

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
    }
  }, [user]);

  if (!isLoaded || !isUserLoaded) {
    return null;
  }

  const inputStyle = [
    formStyles.input,
    {
      borderColor: theme.backgroundSelected,
      backgroundColor: theme.backgroundElement,
      color: theme.text,
    },
  ];

  const handleSave = async () => {
    if (!user) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await user.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      router.back();
    } catch {
      setError('Could not update your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ProfileScreenHeader title="Edit profile" />

        {!isSignedIn ? (
          <ThemedView style={styles.centerState}>
            <ThemedText type="smallBold">Sign in to edit your profile</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
              Sign in to update your name.
            </ThemedText>
            <Pressable
              style={({ pressed }) => [
                formStyles.button,
                { backgroundColor: '#0a7ea4' },
                pressed && formStyles.buttonPressed,
              ]}
              onPress={() => router.push('/(auth)/sign-in' as Href)}>
              <ThemedText style={formStyles.buttonText}>Sign in</ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <ThemedText style={formStyles.label}>First name</ThemedText>
            <TextInput
              style={inputStyle}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
            />

            <ThemedText style={formStyles.label}>Last name</ThemedText>
            <TextInput
              style={inputStyle}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="words"
            />

            {error && <ThemedText style={formStyles.error}>{error}</ThemedText>}

            <Pressable
              style={({ pressed }) => [
                formStyles.button,
                { backgroundColor: '#0a7ea4' },
                isSaving && formStyles.buttonDisabled,
                pressed && formStyles.buttonPressed,
              ]}
              onPress={handleSave}
              disabled={isSaving}>
              <ThemedText style={formStyles.buttonText}>{isSaving ? 'Saving…' : 'Save changes'}</ThemedText>
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
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.three,
    backgroundColor: 'transparent',
  },
  hint: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
