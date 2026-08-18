import { StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { LoanGuarantor } from '@/shared/types/loan';

export function GuarantorList({ guarantors }: { guarantors: LoanGuarantor[] }) {
  if (guarantors.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No guarantors added yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {guarantors.map((g) => (
        <li key={g.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{g.memberId}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Invited {formatDate(g.invitedAt)}
            </p>
          </div>
          <StatusBadge status={g.status} />
        </li>
      ))}
    </ul>
  );
}
