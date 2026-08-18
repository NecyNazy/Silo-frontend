import { PageHeader } from '@/shared/components';

export function ComingSoonScreen({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="rounded-lg border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Coming in Phase 2</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          This screen isn't part of the MVP build yet.
        </p>
      </div>
    </div>
  );
}
