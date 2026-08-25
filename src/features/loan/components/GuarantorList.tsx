import { StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { LoanGuarantor } from '@/shared/types/loan';

export function GuarantorList({
  guarantors,
  memberNames,
}: {
  guarantors: LoanGuarantor[];
  memberNames?: Map<string, string>;
}) {
  if (guarantors.length === 0) {
    return <p className="text-sm text-text-muted">No guarantors added yet.</p>;
  }

  return (
    <ul className="divide-y divide-border-subtle">
      {guarantors.map((g) => (
        <li key={g.id} className="flex items-center justify-between py-2 text-sm">
          <div>
            <p className="font-medium text-text-primary">
              {memberNames?.get(g.memberId) ?? g.memberId}
            </p>
            <p className="text-xs text-text-muted">
              Invited {formatDate(g.invitedAt)}
            </p>
          </div>
          <StatusBadge status={g.status} />
        </li>
      ))}
    </ul>
  );
}
