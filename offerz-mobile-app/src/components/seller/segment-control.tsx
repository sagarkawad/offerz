import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type SegmentOption<T extends string> = {
  id: T;
  label: string;
};

type SegmentControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentControl<T extends string>({ options, value, onChange }: SegmentControlProps<T>) {
  return (
    <ThemedView style={styles.container}>
      {options.map((option) => {
        const isSelected = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => [
              styles.segment,
              isSelected && styles.segmentSelected,
              pressed && styles.pressed,
            ]}>
            <ThemedText type="small" style={isSelected ? styles.labelSelected : styles.label}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
    padding: 3,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
  },
  segment: {
    minWidth: 72,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.one + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: 'rgba(60, 135, 247, 0.18)',
  },
  label: {
    fontWeight: '500',
    opacity: 0.7,
  },
  labelSelected: {
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
