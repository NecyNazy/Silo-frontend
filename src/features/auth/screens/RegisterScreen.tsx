import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterScreen() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-canvas px-4 py-10">
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
        <h1 className="mt-4 text-xl font-semibold text-text-primary">Join Silo</h1>
        <p className="mt-1 text-sm text-text-muted">
          Your account starts with KYC pending. An officer will review it shortly.
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
