import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, ErrorState, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { KycStatus, Member } from '@/shared/types/member';
import { useMembers } from '../hooks';

const columns: ColumnDef<Member, unknown>[] = [
  {
    accessorKey: 'fullName',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        to={`/admin/members/${row.original.id}`}
        className="font-medium text-indigo-700 hover:underline dark:text-indigo-400"
      >
        {row.original.fullName}
      </Link>
    ),
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'kycStatus',
    header: 'KYC',
    cell: ({ row }) => <StatusBadge status={row.original.kycStatus} />,
  },
  {
    accessorKey: 'joinedDate',
    header: 'Joined',
    cell: ({ row }) => formatDate(row.original.joinedDate),
  },
];

const KYC_FILTERS: { label: string; value: KycStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending review', value: 'PENDING' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export function AdminMembersScreen() {
  const [kycFilter, setKycFilter] = useState<KycStatus | 'ALL'>('ALL');
  const { data, isLoading, isError, refetch } = useMembers({
    kycStatus: kycFilter === 'ALL' ? undefined : kycFilter,
  });

  return (
    <div>
      <PageHeader title="Members" description="Member directory and KYC review queue." />

      <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        The backend doesn't expose a member list endpoint yet — this table is backed by seed data
        until that lands.
      </p>

      <div className="mb-4 flex gap-2">
        {KYC_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setKycFilter(filter.value)}
            className={
              filter.value === kycFilter
                ? 'rounded-full bg-indigo-700 px-3 py-1 text-xs font-medium text-white dark:bg-indigo-600'
                : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isError && (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          emptyTitle="No members found"
          searchPlaceholder="Search members…"
        />
      )}
    </div>
  );
}
