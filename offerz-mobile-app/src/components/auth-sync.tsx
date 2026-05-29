import { useUserSync } from '@/hooks/use-user-sync';

export function AuthSync() {
  useUserSync();
  return null;
}
