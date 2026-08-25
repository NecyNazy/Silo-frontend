export type NotificationChannel = 'EMAIL';

export type NotificationDeliveryStatus = 'SENT' | 'FAILED';

export interface Notification {
  id: string;
  memberId: string;
  eventType: string;
  subject: string;
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  sentAt: string;
  readAt: string | null;
}
