import type { ColumnDef } from '@tanstack/react-table';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import { DataTable, ErrorState, FilterPill, PageHeader, StatusBadge } from '@/shared/components';
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
        className="font-medium text-accent hover:underline"
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
  const officerId = useAuthStore((s) => s.memberId);
  const { data, isLoading, isError, refetch } = useMembers({
    kycStatus: kycFilter === 'ALL' ? undefined : kycFilter,
  });
  const members = data?.filter((member) => member.id !== officerId);

  return (
    <div>
      <PageHeader title="Members" description="Member directory and KYC review queue." />

      <p className="mb-4 rounded-control bg-warning-muted px-3 py-2 text-xs text-warning">
        The backend doesn't expose a member list endpoint yet. This table is backed by seed data
        until that lands.
      </p>

      <div className="mb-4 flex gap-2">
        {KYC_FILTERS.map((filter) => (
          <FilterPill
            key={filter.value}
            active={filter.value === kycFilter}
            onClick={() => setKycFilter(filter.value)}
          >
            {filter.label}
          </FilterPill>
        ))}
      </div>

      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isError && (
        <DataTable
          columns={columns}
          data={members ?? []}
          isLoading={isLoading}
          emptyTitle="No members found"
          emptyDescription="Try a different filter, or check back once new members join."
          emptyIcon={Users}
          searchPlaceholder="Search members…"
        />
      )}
    </div>
  );
}
