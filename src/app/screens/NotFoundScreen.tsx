import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components';

export function NotFoundScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-canvas px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="flex flex-col items-center gap-3"
      >
        <p className="text-sm font-semibold tracking-widest text-accent">404</p>
        <h1 className="text-xl font-semibold text-text-primary">Page not found</h1>
        <p className="text-sm text-text-muted">The page you're looking for doesn't exist.</p>
        <Button asChild className="mt-2">
          <Link to="/">Back home</Link>
        </Button>
      </motion.div>
    </div>
  );
}
