import { StatusBadge } from '@/shared/components';
import type { Guarantor } from '@/shared/types/loan';

export function GuarantorList({ guarantors }: { guarantors: Guarantor[] }) {
  if (guarantors.length === 0) {
    return <p className="text-sm text-slate-500">No guarantors added yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {guarantors.map((g) => (
        <li key={g.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            <p className="font-medium text-slate-900">{g.guarantorName}</p>
            <p className="text-xs text-slate-500">Credit score: {g.guarantorCreditScore}</p>
          </div>
          <StatusBadge status={g.status} />
        </li>
      ))}
    </ul>
  );
}
