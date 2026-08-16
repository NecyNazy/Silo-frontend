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
      <Link to={`/loans/${row.original.id}`} className="text-sm font-medium text-indigo-700 hover:underline">
        View
      </Link>
    ),
  },
];

export function MyLoansScreen() {
  const { data: requests, isLoading: requestsLoading } = useMyLoanRequests();
  const { data: loans, isLoading: loansLoading } = useMyLoans();

  const rows: Row[] = [
    ...(requests?.content ?? []).map((r) => ({
      id: r.id,
      kind: 'Request' as const,
      amount: r.amount,
      status: r.status,
      date: r.createdAt,
    })),
    ...(loans?.content ?? []).map((l) => ({
      id: l.id,
      kind: 'Loan' as const,
      amount: l.principal,
      status: l.status,
      date: l.disbursedAt,
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
