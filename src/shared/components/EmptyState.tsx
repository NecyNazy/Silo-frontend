import { Inbox } from 'lucide-react';
import { motion } from 'motion/react';
import type { ComponentType, ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
}

export function EmptyState({ title, description, action, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border-strong bg-surface/40 px-6 py-14 text-center"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22, delay: 0.05 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-muted text-accent"
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </motion.div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description && <p className="max-w-xs text-sm text-text-muted">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
