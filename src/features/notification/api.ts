import { apiClient } from '@/shared/api/client';
import type { Notification } from '@/shared/types/notification';

export async function listNotifications(memberId: string): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>(`/notifications/member/${memberId}`);
  return data;
}
