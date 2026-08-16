import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { DataTable, Money, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { LoanRequest } from '@/shared/types/loan';
import { useLoanRequests } from '../hooks';

const columns: ColumnDef<LoanRequest, unknown>[] = [
  {
    accessorKey: 'memberName',
    header: 'Member',
    cell: ({ row }) => (
      <Link
        to={`/admin/loan-requests/${row.original.id}`}
        className="font-medium text-indigo-700 hover:underline dark:text-indigo-400"
      >
        {row.original.memberName}
      </Link>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <Money amount={row.original.amount} />,
  },
  { accessorKey: 'termMonths', header: 'Term (mo)' },
  {
    id: 'guarantors',
    header: 'Guarantors',
    cell: ({ row }) =>
      `${row.original.guarantors.filter((g) => g.status === 'ACCEPTED').length} accepted`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Submitted',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export function AdminLoanRequestsScreen() {
  const { data, isLoading } = useLoanRequests({ status: 'PENDING' });

  return (
    <div>
      <PageHeader title="Loan requests" description="Pending-approval queue." />
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyTitle="No pending loan requests"
        searchPlaceholder="Search requests…"
      />
    </div>
  );
}
