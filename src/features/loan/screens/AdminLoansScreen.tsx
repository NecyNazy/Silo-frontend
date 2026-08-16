import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, Money, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { Loan, LoanStatus } from '@/shared/types/loan';
import { useLoans } from '../hooks';

const columns: ColumnDef<Loan, unknown>[] = [
  {
    accessorKey: 'memberName',
    header: 'Member',
    cell: ({ row }) => (
      <Link
        to={`/admin/loans/${row.original.id}`}
        className="font-medium text-indigo-700 hover:underline"
      >
        {row.original.memberName}
      </Link>
    ),
  },
  {
    accessorKey: 'principal',
    header: 'Principal',
    cell: ({ row }) => <Money amount={row.original.principal} />,
  },
  {
    accessorKey: 'outstandingBalance',
    header: 'Outstanding',
    cell: ({ row }) => <Money amount={row.original.outstandingBalance} />,
  },
  {
    accessorKey: 'disbursedAt',
    header: 'Disbursed',
    cell: ({ row }) => formatDate(row.original.disbursedAt),
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
  const { data, isLoading } = useLoans({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  return (
    <div>
      <PageHeader title="Loans" description="All loans, filterable by status." />

      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={
              filter.value === statusFilter
                ? 'rounded-full bg-indigo-700 px-3 py-1 text-xs font-medium text-white'
                : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200'
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyTitle="No loans found"
        searchPlaceholder="Search loans…"
      />
    </div>
  );
}
