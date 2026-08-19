import { motion } from 'motion/react';
import { PageHeader } from '@/shared/components';

export function ComingSoonScreen({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="rounded-card border border-dashed border-border-strong px-6 py-16 text-center"
      >
        <p className="text-sm font-medium text-text-primary">Coming in Phase 2</p>
        <p className="mt-1 text-sm text-text-muted">This screen isn't part of the MVP build yet.</p>
      </motion.div>
    </div>
  );
}
