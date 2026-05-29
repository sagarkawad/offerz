import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

const tabIcons = {
  shops: { ios: 'storefront', android: 'store', web: 'store' },
  add: { ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' },
  profile: { ios: 'person', android: 'person', web: 'person' },
} as const;

function SellerTabButton({
  children,
  isFocused,
  icon,
  ...props
}: TabTriggerSlotProps & { icon: (typeof tabIcons)[keyof typeof tabIcons] }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <SymbolView
          name={icon}
          size={16}
          tintColor={isFocused ? colors.text : colors.textSecondary}
        />
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

function AddTabButton({
  children,
  isFocused,
  ...props
}: TabTriggerSlotProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.addButtonView}>
        <SymbolView
          name={tabIcons.add}
          size={22}
          tintColor={isFocused ? colors.text : colors.textSecondary}
        />
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

function SellerTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

export default function SellerTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <SellerTabList>
          <TabTrigger name="shops" href="/shops" asChild>
            <SellerTabButton icon={tabIcons.shops}>Shops</SellerTabButton>
          </TabTrigger>
          <TabTrigger name="add" href="/add" asChild>
            <AddTabButton>Add</AddTabButton>
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <SellerTabButton icon={tabIcons.profile}>Profile</SellerTabButton>
          </TabTrigger>
        </SellerTabList>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 0,
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
    justifyContent: 'space-around',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
  },
  addButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.half,
    minWidth: 72,
  },
});
