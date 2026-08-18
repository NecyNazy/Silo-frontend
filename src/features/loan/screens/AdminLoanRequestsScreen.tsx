import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import { DataTable, ErrorState, Money, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { LoanRequest } from '@/shared/types/loan';
import { useLoanRequests } from '../hooks';

const columns: ColumnDef<LoanRequest, unknown>[] = [
  {
    id: 'member',
    header: 'Member',
    cell: ({ row }) => (
      <Link
        to={`/admin/loan-requests/${row.original.id}`}
        className="font-medium text-accent hover:underline"
      >
        {row.original.memberId}
      </Link>
    ),
  },
  { accessorKey: 'purpose', header: 'Purpose' },
  {
    accessorKey: 'amountRequested',
    header: 'Amount',
    cell: ({ row }) => <Money amount={row.original.amountRequested} />,
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted',
    cell: ({ row }) => formatDate(row.original.submittedAt),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export function AdminLoanRequestsScreen() {
  const officerId = useAuthStore((s) => s.memberId);
  const { data, isLoading, isError, refetch } = useLoanRequests({ status: 'PENDING' });
  const requests = data?.filter((request) => request.memberId !== officerId);

  return (
    <div>
      <PageHeader title="Loan requests" description="Pending-approval queue." />
      <p className="mb-4 rounded-control bg-warning-muted px-3 py-2 text-xs text-warning">
        The backend doesn't expose a loan-request list endpoint yet. This queue is backed by
        seed data until that lands.
      </p>
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={requests ?? []}
          isLoading={isLoading}
          emptyTitle="No pending loan requests"
          emptyDescription="Requests awaiting review will appear in this queue."
          emptyIcon={ClipboardCheck}
          searchPlaceholder="Search requests…"
        />
      )}
    </div>
  );
}
