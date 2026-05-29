import { useAuth, useSignUp } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authFormStyles as styles } from '@/components/auth-form-styles';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const navigateAfterAuth = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          return;
        }
        const url = decorateUrl('/(tabs)');
        if (Platform.OS === 'web' && url.startsWith('http')) {
          window.location.href = url;
        } else {
          router.replace(url as Href);
        }
      },
    });
  };

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      return;
    }
    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') {
      await navigateAfterAuth();
    }
  };

  const inputStyle = [
    styles.input,
    {
      borderColor: theme.backgroundSelected,
      backgroundColor: theme.backgroundElement,
      color: theme.text,
    },
  ];

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView>
          <ThemedText type="title" style={styles.title}>
            Verify your account
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor={theme.textSecondary}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          {errors.fields.code && (
            <ThemedText style={styles.error}>{errors.fields.code.message}</ThemedText>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: '#0a7ea4' },
              fetchStatus === 'fetching' && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleVerify}
            disabled={fetchStatus === 'fetching'}>
            <ThemedText style={styles.buttonText}>Verify</ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => signUp.verifications.sendEmailCode()}>
            <ThemedText type="linkPrimary">I need a new code</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText type="title" style={styles.title}>
          Sign up
        </ThemedText>

        <ThemedText style={styles.label}>Email address</ThemedText>
        <TextInput
          style={inputStyle}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={theme.textSecondary}
          onChangeText={setEmailAddress}
          keyboardType="email-address"
        />
        {errors.fields.emailAddress && (
          <ThemedText style={styles.error}>{errors.fields.emailAddress.message}</ThemedText>
        )}

        <ThemedText style={styles.label}>Password</ThemedText>
        <TextInput
          style={inputStyle}
          value={password}
          placeholder="Enter password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          onChangeText={setPassword}
        />
        {errors.fields.password && (
          <ThemedText style={styles.error}>{errors.fields.password.message}</ThemedText>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: '#0a7ea4' },
            (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!emailAddress || !password || fetchStatus === 'fetching'}>
          <ThemedText style={styles.buttonText}>Sign up</ThemedText>
        </Pressable>

        <View nativeID="clerk-captcha" />

        <View style={styles.linkContainer}>
          <ThemedText>Already have an account? </ThemedText>
          <Link href="/(auth)/sign-in">
            <ThemedText type="linkPrimary">Sign in</ThemedText>
          </Link>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
