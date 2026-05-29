import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const authFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    justifyContent: 'center',
  },
  title: {
    marginBottom: Spacing.two,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
  },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginTop: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
  },
});
