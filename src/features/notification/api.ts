import { apiClient } from '@/shared/api/client';
import type { Notification } from '@/shared/types/notification';

export async function listNotifications(memberId: string): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>(`/notifications/member/${memberId}`);
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(memberId: string): Promise<void> {
  await apiClient.patch(`/notifications/member/${memberId}/read-all`);
}
