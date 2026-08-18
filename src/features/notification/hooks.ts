import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import { listNotifications } from './api';

export function useNotifications() {
  const memberId = useAuthStore((s) => s.memberId);
  return useQuery({
    queryKey: ['notifications', memberId],
    queryFn: () => listNotifications(memberId as string),
    enabled: Boolean(memberId),
    staleTime: 15_000,
  });
}
