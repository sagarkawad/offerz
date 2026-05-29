import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ViewToken,
} from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AddCarouselItem = {
  id: string;
  label: string;
  href: Href;
};

const ITEMS: AddCarouselItem[] = [
  { id: 'create-shop', label: 'Create shop', href: '/seller/create-shop' },
  { id: 'create-offer', label: 'Create offer', href: '/seller/create-offer' },
];

export function AddCarousel() {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - Spacing.four * 2 - 96, 280);
  const listRef = useRef<FlatList<AddCarouselItem>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + Spacing.three));
    setActiveIndex(index);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.carouselRow}>
        <Pressable
          onPress={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
          disabled={activeIndex === 0}
          style={({ pressed }) => [styles.navButton, pressed && styles.pressed, activeIndex === 0 && styles.disabled]}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={24}
            tintColor={theme.text}
          />
        </Pressable>

        <FlatList
          ref={listRef}
          data={ITEMS}
          horizontal
          pagingEnabled={false}
          snapToInterval={cardWidth + Spacing.three}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(item.href)}
              style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.cardInner}>
                <ThemedView type="backgroundSelected" style={styles.plusCircle}>
                  <SymbolView
                    name={{ ios: 'plus', android: 'add', web: 'add' }}
                    size={32}
                    tintColor="#3c87f7"
                  />
                </ThemedView>
                <ThemedText type="subtitle">{item.label}</ThemedText>
              </ThemedView>
            </Pressable>
          )}
        />

        <Pressable
          onPress={() => scrollToIndex(Math.min(activeIndex + 1, ITEMS.length - 1))}
          disabled={activeIndex === ITEMS.length - 1}
          style={({ pressed }) => [
            styles.navButton,
            pressed && styles.pressed,
            activeIndex === ITEMS.length - 1 && styles.disabled,
          ]}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={24}
            tintColor={theme.text}
          />
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.dots}>
        {ITEMS.map((item, index) => (
          <ThemedView
            key={item.id}
            type={index === activeIndex ? 'backgroundSelected' : 'backgroundElement'}
            style={styles.dot}
          />
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  navButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
  },
  listContent: {
    paddingHorizontal: Spacing.one,
    gap: Spacing.three,
  },
  card: {
    backgroundColor: 'transparent',
  },
  cardInner: {
    minHeight: 220,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  plusCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
    backgroundColor: 'transparent',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.35,
  },
});
