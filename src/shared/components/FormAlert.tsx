import { motion } from 'motion/react';

export interface FormAlertProps {
  message?: string | null;
}

export function FormAlert({ message }: FormAlertProps) {
  if (!message) return null;

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      className="rounded-control border border-danger/25 bg-danger-muted px-3 py-2 text-sm text-danger"
    >
      {message}
    </motion.div>
  );
}
