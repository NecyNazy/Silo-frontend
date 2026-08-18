import { Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, EmptyState, PageHeader, StatusBadge } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatRelative } from '@/shared/lib/date';
import { fadeInUp, staggerChildren } from '@/shared/lib/motion';
import { useNotifications } from '../hooks';
import { formatEventType } from '../lib';

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
        <EmptyState
          title="No notifications yet"
          description="Emails about your loans, contributions, and invites land here."
          icon={Bell}
        />
      )}

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerChildren(0.04)}
        className="space-y-2"
      >
        {notifications?.map((notification) => (
          <motion.div key={notification.id} variants={fadeInUp}>
            <Card>
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {formatEventType(notification.eventType)}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Sent via {notification.channel.toLowerCase()} {formatRelative(notification.sentAt)}
                  </p>
                </div>
                <StatusBadge status={notification.status} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
