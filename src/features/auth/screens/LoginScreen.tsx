import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components';
import { LoginForm } from '../components/LoginForm';

export function LoginScreen() {
  const location = useLocation();
  const justRegistered = Boolean(
    (location.state as { justRegistered?: boolean } | null)?.justRegistered,
  );

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-canvas px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, var(--color-accent-muted), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="relative z-10 w-full max-w-sm rounded-card border border-border-subtle bg-surface/90 p-8 shadow-raised backdrop-blur-xl"
      >
        <Link to="/" className="text-lg font-semibold tracking-tight text-text-primary">
          Silo<span className="text-accent">.</span>
        </Link>
        <h1 className="mt-4 text-xl font-semibold text-text-primary">Sign in to your account</h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage your contributions, loans, and repayments.
        </p>

        {justRegistered && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-control bg-success-muted px-3 py-2 text-sm text-success"
          >
            Account created. Sign in to continue, your KYC review is pending.
          </motion.p>
        )}

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          New to Silo?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
