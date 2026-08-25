import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import type { Notification } from '@/shared/types/notification';
import { listNotifications, markAllNotificationsRead, markNotificationRead } from './api';

export function useNotifications() {
  const memberId = useAuthStore((s) => s.memberId);
  return useQuery({
    queryKey: ['notifications', memberId],
    queryFn: () => listNotifications(memberId as string),
    enabled: Boolean(memberId),
    staleTime: 15_000,
  });
}

export function useUnreadNotifications() {
  const memberId = useAuthStore((s) => s.memberId);
  const queryClient = useQueryClient();
  const { data: notifications } = useNotifications();

  const hasUnread = notifications?.some((n) => n.readAt === null) ?? false;

  const markAllRead = useMutation({
    mutationFn: () => markAllNotificationsRead(memberId as string),
    onMutate: () => {
      queryClient.setQueryData<Notification[]>(['notifications', memberId], (current) =>
        current?.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })),
      );
    },
  });

  return {
    hasUnread,
    markAllRead: () => {
      if (memberId) markAllRead.mutate();
    },
  };
}

export function useMarkNotificationRead() {
  const memberId = useAuthStore((s) => s.memberId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: (id) => {
      queryClient.setQueryData<Notification[]>(['notifications', memberId], (current) =>
        current?.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)),
      );
    },
  });
}
