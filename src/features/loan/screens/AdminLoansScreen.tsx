import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardCheck, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import { useMembers } from '@/features/member/hooks';
import {
  DataTable,
  ErrorState,
  FilterPill,
  Money,
  PageHeader,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { Loan, LoanRequest, LoanStatus } from '@/shared/types/loan';
import { useLoanRequests, useLoans } from '../hooks';

const STATUS_FILTERS: { label: string; value: LoanStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Closed', value: 'CLOSED' },
  { label: 'Defaulted', value: 'DEFAULTED' },
];

function useMemberNames() {
  const { data: members } = useMembers();
  return new Map(members?.map((m) => [m.id, m.fullName]));
}

function useRequestColumns(memberNames: Map<string, string>): ColumnDef<LoanRequest, unknown>[] {
  return [
    {
      id: 'member',
      header: 'Member',
      cell: ({ row }) => (
        <Link
          to={`/admin/loan-requests/${row.original.id}`}
          className="font-medium text-accent hover:underline"
        >
          {memberNames.get(row.original.memberId) ?? row.original.memberId}
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
}

function useLoanColumns(memberNames: Map<string, string>): ColumnDef<Loan, unknown>[] {
  return [
    {
      id: 'member',
      header: 'Member',
      cell: ({ row }) => (
        <Link
          to={`/admin/loans/${row.original.id}`}
          className="font-medium text-accent hover:underline"
        >
          {memberNames.get(row.original.memberId) ?? row.original.memberId}
        </Link>
      ),
    },
    {
      accessorKey: 'principalAmount',
      header: 'Principal',
      cell: ({ row }) => <Money amount={row.original.principalAmount} />,
    },
    {
      accessorKey: 'outstandingBalance',
      header: 'Outstanding',
      cell: ({ row }) => <Money amount={row.original.outstandingBalance} />,
    },
    {
      accessorKey: 'disbursedDate',
      header: 'Disbursed',
      cell: ({ row }) => formatDate(row.original.disbursedDate),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];
}

export function AdminLoansScreen() {
  const officerId = useAuthStore((s) => s.memberId);
  const memberNames = useMemberNames();
  const requestColumns = useRequestColumns(memberNames);
  const loanColumns = useLoanColumns(memberNames);

  const {
    data: requestsData,
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useLoanRequests({ status: 'PENDING' });
  const requests = requestsData?.filter((request) => request.memberId !== officerId);

  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'ALL'>('ALL');
  const {
    data: loans,
    isLoading: loansLoading,
    isError: loansError,
    refetch: refetchLoans,
  } = useLoans({ status: statusFilter === 'ALL' ? undefined : statusFilter });

  const pendingCount = requests?.length ?? 0;

  return (
    <div>
      <PageHeader title="Loans" description="Review pending requests and track disbursed loans." />

      <Tabs defaultValue="requests">
        <TabsList className="mb-4">
          <TabsTrigger value="requests">
            Requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
          </TabsTrigger>
          <TabsTrigger value="loans">All loans</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          {requestsError ? (
            <ErrorState onRetry={() => refetchRequests()} />
          ) : (
            <DataTable
              columns={requestColumns}
              data={requests ?? []}
              isLoading={requestsLoading}
              emptyTitle="No pending loan requests"
              emptyDescription="Requests awaiting review will appear in this queue."
              emptyIcon={ClipboardCheck}
              searchPlaceholder="Search requests…"
            />
          )}
        </TabsContent>

        <TabsContent value="loans">
          <div className="mb-4 flex gap-2">
            {STATUS_FILTERS.map((filter) => (
              <FilterPill
                key={filter.value}
                active={filter.value === statusFilter}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </FilterPill>
            ))}
          </div>

          {loansError ? (
            <ErrorState onRetry={() => refetchLoans()} />
          ) : (
            <DataTable
              columns={loanColumns}
              data={loans ?? []}
              isLoading={loansLoading}
              emptyTitle="No loans found"
              emptyDescription="Approved loans and their repayment status will show up here."
              emptyIcon={Wallet}
              searchPlaceholder="Search loans…"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
