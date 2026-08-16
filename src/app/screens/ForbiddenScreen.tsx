import { Link } from 'react-router-dom';
import { Button } from '@/shared/components';

export function ForbiddenScreen() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium text-red-700">403</p>
      <h1 className="text-xl font-semibold text-slate-900">Access denied</h1>
      <p className="text-sm text-slate-500">Your account doesn't have access to this page.</p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </div>
  );
}
