import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { useMyProfile } from '@/features/member/hooks';
import { Button, DataTable, ErrorState, Money, PageHeader, StatusBadge } from '@/shared/components';
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
  const { data: member } = useMyProfile();
  const {
    data: requests,
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useMyLoanRequests();
  const {
    data: loans,
    isLoading: loansLoading,
    isError: loansError,
    refetch: refetchLoans,
  } = useMyLoans();

  const canApply = member?.status === 'ACTIVE' && member?.kycStatus === 'VERIFIED';
  const applyBlockedReason = !member
    ? undefined
    : member.kycStatus !== 'VERIFIED'
      ? 'Your KYC must be verified before you can apply for a loan.'
      : member.status !== 'ACTIVE'
        ? 'Your account must be active before you can apply for a loan.'
        : undefined;

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
          canApply ? (
            <Button asChild>
              <Link to="/loans/apply">Apply for a loan</Link>
            </Button>
          ) : (
            <Button disabled>Apply for a loan</Button>
          )
        }
      />
      {applyBlockedReason && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          {applyBlockedReason}
        </p>
      )}
      <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        The backend doesn't expose list endpoints for loan requests or loans yet. This table is
        backed by seed data until that lands, so requests you submit for real won't appear here.
      </p>
      {requestsError || loansError ? (
        <ErrorState
          onRetry={() => {
            refetchRequests();
            refetchLoans();
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          isLoading={requestsLoading || loansLoading}
          emptyTitle="No loans or requests yet"
          searchPlaceholder="Search…"
        />
      )}
    </div>
  );
}
