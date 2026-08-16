import type { ColumnDef } from '@tanstack/react-table';
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
        className="font-medium text-indigo-700 hover:underline dark:text-indigo-400"
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
      <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
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
          searchPlaceholder="Search requests…"
        />
      )}
    </div>
  );
}
