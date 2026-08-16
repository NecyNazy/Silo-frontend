import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, ErrorState, PageHeader, StatusBadge } from '@/shared/components';
import type { KycStatus, Member } from '@/shared/types/member';
import { useMembers } from '../hooks';

const columns: ColumnDef<Member, unknown>[] = [
  {
    accessorKey: 'fullName',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        to={`/admin/members/${row.original.id}`}
        className="font-medium text-indigo-700 hover:underline"
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
  { accessorKey: 'creditScore', header: 'Credit score' },
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

      <div className="mb-4 flex gap-2">
        {KYC_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setKycFilter(filter.value)}
            className={
              filter.value === kycFilter
                ? 'rounded-full bg-indigo-700 px-3 py-1 text-xs font-medium text-white'
                : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200'
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
          data={data?.content ?? []}
          isLoading={isLoading}
          emptyTitle="No members found"
          searchPlaceholder="Search members…"
        />
      )}
    </div>
  );
}
