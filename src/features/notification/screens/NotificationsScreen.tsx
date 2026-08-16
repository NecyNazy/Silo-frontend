import { Card, CardContent, EmptyState, PageHeader, StatusBadge } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatRelative } from '@/shared/lib/date';
import { useNotifications } from '../hooks';

function formatEventType(eventType: string): string {
  return eventType
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function NotificationsScreen() {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Email delivery history for your account."
      />

      {isLoading && <Skeleton className="h-40 w-full" />}
      {!isLoading && (notifications?.length ?? 0) === 0 && (
        <EmptyState title="No notifications yet" />
      )}

      <div className="space-y-2">
        {notifications?.map((notification) => (
          <Card key={notification.id}>
            <CardContent className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {formatEventType(notification.eventType)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Sent via {notification.channel.toLowerCase()} {formatRelative(notification.sentAt)}
                </p>
              </div>
              <StatusBadge status={notification.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
