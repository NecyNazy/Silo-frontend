import type { ColumnDef } from '@tanstack/react-table';
import { Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMyProfile } from '@/features/member/hooks';
import {
  DataTable,
  ErrorState,
  Money,
  PageHeader,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import { GuarantorInvitesList } from '../components/GuarantorInvitesList';
import { LoanApplyDialog } from '../components/LoanApplyDialog';
import { useGuarantorInvites, useMyLoanRequests, useMyLoans } from '../hooks';

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
        className="text-sm font-medium text-accent hover:underline"
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
  const { data: invites } = useGuarantorInvites();

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

  const inviteCount = invites?.length ?? 0;

  return (
    <div>
      <PageHeader
        title="Loans"
        description="Requests you've submitted, loans you've been disbursed, and guarantee invites."
        action={
          <LoanApplyDialog disabled={!canApply} disabledReason={applyBlockedReason} />
        }
      />
      {applyBlockedReason && (
        <p className="mb-4 rounded-control bg-warning-muted px-3 py-2 text-sm text-warning">
          {applyBlockedReason}
        </p>
      )}
      <p className="mb-4 rounded-control bg-warning-muted px-3 py-2 text-xs text-warning">
        The backend doesn't expose list endpoints for loan requests or loans yet. This table is
        backed by seed data until that lands, so requests you submit for real won't appear here.
      </p>

      <Tabs defaultValue="loans">
        <TabsList>
          <TabsTrigger value="loans">My loans</TabsTrigger>
          <TabsTrigger value="invites">
            Guarantor invites{inviteCount > 0 ? ` (${inviteCount})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loans">
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
              emptyDescription="Apply for a loan and it'll show up here alongside its status."
              emptyIcon={Wallet}
              searchPlaceholder="Search…"
            />
          )}
        </TabsContent>

        <TabsContent value="invites">
          <GuarantorInvitesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
