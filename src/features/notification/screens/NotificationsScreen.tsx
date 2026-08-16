import { Card, CardContent, EmptyState, PageHeader } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatRelative } from '@/shared/lib/date';
import { useNotifications } from '../hooks';

export function NotificationsScreen() {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <div>
      <PageHeader title="Notifications" description="Your notification history." />

      {isLoading && <Skeleton className="h-40 w-full" />}
      {!isLoading && (notifications?.length ?? 0) === 0 && (
        <EmptyState title="No notifications yet" />
      )}

      <div className="space-y-2">
        {notifications?.map((notification) => (
          <Card key={notification.id} className={notification.read ? 'opacity-70' : ''}>
            <CardContent className="flex items-start justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{notification.message}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">
                {formatRelative(notification.createdAt)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
