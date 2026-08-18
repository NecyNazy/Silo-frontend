import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/features/notification/hooks';
import { formatEventType } from '@/features/notification/lib';
import { formatRelative } from '../lib/date';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { StatusBadge } from './StatusBadge';

const RECENT_COUNT = 5;

export function NotificationBell() {
  const { data: notifications } = useNotifications();
  const recent = notifications?.slice(0, RECENT_COUNT) ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-control text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
        >
          <Bell className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Notifications
        </div>
        <DropdownMenuSeparator />
        {recent.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-text-muted">You're all caught up.</p>
        ) : (
          recent.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex-col items-start gap-0.5 py-2">
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-medium text-text-primary">
                  {formatEventType(notification.eventType)}
                </span>
                <StatusBadge status={notification.status} />
              </span>
              <span className="text-xs text-text-muted">{formatRelative(notification.sentAt)}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="block w-full text-center font-medium text-accent">
            View all
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
