import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { Button, DataTable, Money, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import { useMyLoanRequests, useMyLoans } from '../hooks';

interface Row {
  id: string;
  kind: 'Request' | 'Loan';
  amount: number;
  status: string;
  date: string;
}

const columns: ColumnDef<Row, unknown>[] = [
  {
    accessorKey: 'kind',
    header: 'Type',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <Money amount={row.original.amount} />,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to={`/loans/${row.original.id}`}
        className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-400"
      >
        View
      </Link>
    ),
  },
];

export function MyLoansScreen() {
  const { data: requests, isLoading: requestsLoading } = useMyLoanRequests();
  const { data: loans, isLoading: loansLoading } = useMyLoans();

  const rows: Row[] = [
    ...(requests ?? []).map((r) => ({
      id: r.id,
      kind: 'Request' as const,
      amount: r.amountRequested,
      status: r.status,
      date: r.submittedAt,
    })),
    ...(loans ?? []).map((l) => ({
      id: l.id,
      kind: 'Loan' as const,
      amount: l.principalAmount,
      status: l.status,
      date: l.disbursedDate,
    })),
  ];

  return (
    <div>
      <PageHeader
        title="My loans"
        description="Requests you've submitted and loans you've been disbursed."
        action={
          <Button asChild>
            <Link to="/loans/apply">Apply for a loan</Link>
          </Button>
        }
      />
      <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        The backend doesn't expose list endpoints for loan requests or loans yet — this table is
        backed by seed data until that lands, so requests you submit for real won't appear here.
      </p>
      <DataTable
        columns={columns}
        data={rows}
        isLoading={requestsLoading || loansLoading}
        emptyTitle="No loans or requests yet"
        searchPlaceholder="Search…"
      />
    </div>
  );
}
