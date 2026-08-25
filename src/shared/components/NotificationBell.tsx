import { Bell, Check } from 'lucide-react';
import {
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotifications,
} from '@/features/notification/hooks';
import { formatRelative } from '../lib/date';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

const RECENT_COUNT = 5;

export function NotificationBell() {
  const { data: notifications } = useNotifications();
  const { hasUnread, markAllRead } = useUnreadNotifications();
  const markRead = useMarkNotificationRead();
  const unread = notifications?.filter((n) => n.readAt === null).slice(0, RECENT_COUNT) ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={hasUnread ? 'Notifications, unread' : 'Notifications'}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-control text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
        >
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span
              className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface"
              aria-hidden="true"
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Notifications
        </div>
        <DropdownMenuSeparator />
        {unread.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-text-muted">You're all caught up.</p>
        ) : (
          unread.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onSelect={(e) => {
                e.preventDefault();
                markRead.mutate(notification.id);
              }}
              className="flex items-start justify-between gap-2 py-2"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-text-primary">
                  {notification.subject}
                </span>
                <span className="text-xs text-text-muted">
                  {formatRelative(notification.sentAt)}
                </span>
              </span>
              <span className="mt-0.5 shrink-0 text-text-muted" title="Mark as read">
                <Check className="h-4 w-4" />
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!hasUnread}
          onSelect={(e) => {
            e.preventDefault();
            markAllRead();
          }}
          className="justify-center text-center font-medium text-accent"
        >
          Mark all read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
