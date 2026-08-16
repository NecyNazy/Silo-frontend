import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterScreen() {
  return (
    <div className="relative flex min-h-svh items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Join Silo</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your account starts with KYC pending — an officer will review it shortly.
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-700 hover:underline dark:text-indigo-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
