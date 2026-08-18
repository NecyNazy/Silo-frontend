import { motion } from 'motion/react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>;

export interface FilterPillProps extends NativeButtonProps {
  active?: boolean;
}

export function FilterPill({ active, className, ...props }: FilterPillProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        active
          ? 'bg-accent text-white'
          : 'bg-surface-raised text-text-secondary ring-1 ring-inset ring-border-subtle hover:text-text-primary',
        className,
      )}
      {...props}
    />
  );
}
