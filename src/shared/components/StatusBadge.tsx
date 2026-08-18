import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { statusTone, type StatusTone } from '../lib/status';

const TONE_CLASSES: Record<StatusTone, string> = {
  success: 'bg-success-muted text-success ring-success/25',
  warning: 'bg-warning-muted text-warning ring-warning/25',
  danger: 'bg-danger-muted text-danger ring-danger/25',
  neutral: 'bg-surface-raised text-text-secondary ring-border-strong',
  info: 'bg-info-muted text-info ring-info/25',
};

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const tone = statusTone(status);
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')}
    </motion.span>
  );
}
