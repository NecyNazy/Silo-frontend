import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, ErrorState, FilterPill, Money, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { Loan, LoanStatus } from '@/shared/types/loan';
import { useLoans } from '../hooks';

const columns: ColumnDef<Loan, unknown>[] = [
  {
    id: 'member',
    header: 'Member',
    cell: ({ row }) => (
      <Link
        to={`/admin/loans/${row.original.id}`}
        className="font-medium text-indigo-700 hover:underline dark:text-indigo-400"
      >
        {row.original.memberId}
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

const STATUS_FILTERS: { label: string; value: LoanStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Closed', value: 'CLOSED' },
  { label: 'Defaulted', value: 'DEFAULTED' },
];

export function AdminLoansScreen() {
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'ALL'>('ALL');
  const { data, isLoading, isError, refetch } = useLoans({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  return (
    <div>
      <PageHeader title="Loans" description="All loans, filterable by status." />

      <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        The backend doesn't expose a loans list endpoint yet. This table is backed by seed data
        until that lands.
      </p>

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

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          emptyTitle="No loans found"
          searchPlaceholder="Search loans…"
        />
      )}
    </div>
  );
}
