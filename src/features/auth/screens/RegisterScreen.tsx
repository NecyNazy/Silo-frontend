import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Join Silo</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your account starts with KYC pending — an officer will review it shortly.
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
