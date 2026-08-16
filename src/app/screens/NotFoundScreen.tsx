import { Link } from 'react-router-dom';
import { Button } from '@/shared/components';

export function NotFoundScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">404</p>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </div>
  );
}
