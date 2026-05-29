import { useSignIn } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authFormStyles as styles } from '@/components/auth-form-styles';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const theme = useTheme();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');

  const navigateAfterAuth = async () => {
    await signIn.finalize({
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
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === 'complete') {
      await navigateAfterAuth();
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === 'complete') {
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

  if (signIn.status === 'needs_client_trust') {
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
            onPress={() => signIn.mfa.sendEmailCode()}>
            <ThemedText type="linkPrimary">I need a new code</ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => signIn.reset()}>
            <ThemedText type="linkPrimary">Start over</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText type="title" style={styles.title}>
          Sign in
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
        {errors.fields.identifier && (
          <ThemedText style={styles.error}>{errors.fields.identifier.message}</ThemedText>
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
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </Pressable>

        <View style={styles.linkContainer}>
          <ThemedText>Don&apos;t have an account? </ThemedText>
          <Link href="/(auth)/sign-up">
            <ThemedText type="linkPrimary">Sign up</ThemedText>
          </Link>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
