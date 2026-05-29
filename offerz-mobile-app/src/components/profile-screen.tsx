import { useAuth, useClerk, useUser } from '@clerk/expo';
import { type Href, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';
import { parseApiResponse } from '@/lib/api';

type MenuItem = {
  label: string;
  icon:
    | { ios: 'person.circle'; android: 'person'; web: 'person' }
    | { ios: 'info.circle'; android: 'info'; web: 'info' }
    | { ios: 'questionmark.circle'; android: 'help'; web: 'help' }
    | { ios: 'rectangle.portrait.and.arrow.right'; android: 'logout'; web: 'logout' }
    | { ios: 'person.badge.plus'; android: 'person_add'; web: 'person_add' }
    | { ios: 'trash'; android: 'delete'; web: 'delete' };
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type ProfileScreenProps = {
  variant: 'buyer' | 'seller' | 'admin';
};

function MenuRow({ item }: { item: MenuItem }) {
  const theme = useTheme();
  const accentColor = item.destructive ? '#d32f2f' : theme.text;

  return (
    <Pressable
      onPress={item.onPress}
      disabled={item.disabled}
      style={({ pressed }) => [
        styles.menuRow,
        item.disabled && styles.disabled,
        pressed && !item.disabled && styles.pressed,
      ]}>
      <SymbolView name={item.icon} size={20} tintColor={accentColor} />
      <ThemedText type="default" style={[styles.menuLabel, item.destructive && { color: accentColor }]}>
        {item.label}
      </ThemedText>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={14}
        tintColor={theme.textSecondary}
      />
    </Pressable>
  );
}

function getInitials(firstName?: string | null, lastName?: string | null, email?: string | null): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return 'G';
}

export function ProfileScreen({ variant }: ProfileScreenProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const { fetchApi } = useApi();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteAccount = React.useCallback(() => {
    Alert.alert(
      'Delete account?',
      'This permanently removes your account, saved offers, and any shops or offers you created. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);

            try {
              const response = await fetchApi('/api/users/me', { method: 'DELETE' });
              await parseApiResponse<{ deleted: boolean }>(response);
              await signOut();
            } catch {
              Alert.alert('Error', 'Could not delete your account. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }, [fetchApi, signOut]);

  if (!isLoaded) {
    return null;
  }

  const displayName = isSignedIn
    ? [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.primaryEmailAddress?.emailAddress || 'User'
    : 'Guest User';

  const subtitle = isSignedIn
    ? variant === 'seller'
      ? user?.primaryEmailAddress?.emailAddress ?? 'Manage your shops and offers'
      : variant === 'admin'
        ? user?.primaryEmailAddress?.emailAddress ?? 'Review and approve shops'
        : user?.primaryEmailAddress?.emailAddress ?? ''
    : variant === 'seller'
      ? 'Sign in to manage your shops'
      : variant === 'admin'
        ? 'Sign in to review shops'
        : 'Sign in to sync your saved offers';

  const avatarInitial = isSignedIn
    ? getInitials(user?.firstName, user?.lastName, user?.primaryEmailAddress?.emailAddress)
    : 'G';

  const menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        {
          label: 'Edit profile',
          icon: { ios: 'person.circle', android: 'person', web: 'person' },
          onPress: () => router.push('/edit-profile' as Href),
        },
        ...(isSignedIn
          ? [
              {
                label: isDeleting ? 'Deleting account…' : 'Delete account',
                icon: { ios: 'trash' as const, android: 'delete' as const, web: 'delete' as const },
                onPress: handleDeleteAccount,
                destructive: true,
                disabled: isDeleting,
              },
            ]
          : []),
      ],
    },
    {
      title: 'App',
      items: [
        {
          label: 'About',
          icon: { ios: 'info.circle', android: 'info', web: 'info' },
          onPress: () => router.push('/about' as Href),
        },
        {
          label: 'Help',
          icon: { ios: 'questionmark.circle', android: 'help', web: 'help' },
          onPress: () => router.push('/help' as Href),
        },
      ],
    },
    {
      title: 'Session',
      items: isSignedIn
        ? [
            {
              label: 'Sign out',
              icon: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
              onPress: () => signOut(),
            },
          ]
        : [
            {
              label: 'Sign in',
              icon: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
              onPress: () => router.push('/(auth)/sign-in' as Href),
            },
          ],
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.header}>
          <ThemedView type="backgroundElement" style={styles.avatar}>
            <ThemedText type="subtitle" style={styles.avatarText}>
              {avatarInitial}
            </ThemedText>
          </ThemedView>
          <ThemedText type="smallBold">{displayName}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        </ThemedView>

        {menuSections.map((section) => (
          <ThemedView key={section.title} style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
            <ThemedView type="backgroundElement" style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <ThemedView key={item.label}>
                  <MenuRow item={item} />
                  {index < section.items.length - 1 && (
                    <ThemedView type="backgroundSelected" style={styles.divider} />
                  )}
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        ))}
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
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.one,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  avatarText: {
    fontSize: 28,
    lineHeight: 32,
  },
  section: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    marginBottom: Spacing.two,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
    backgroundColor: 'transparent',
  },
  menuLabel: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.three + 20 + Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
