import { Link, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

export function LoginScreen() {
  const location = useLocation();
  const justRegistered = Boolean(
    (location.state as { justRegistered?: boolean } | null)?.justRegistered,
  );

  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Sign in to Silo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your contributions, loans, and repayments.
        </p>

        {justRegistered && (
          <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Account created. Sign in to continue — your KYC review is pending.
          </p>
        )}

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to Silo?{' '}
          <Link to="/register" className="font-medium text-indigo-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
