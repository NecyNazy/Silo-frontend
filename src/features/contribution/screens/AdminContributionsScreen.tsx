import type { ColumnDef } from '@tanstack/react-table';
import { PiggyBank } from 'lucide-react';
import { useMembers } from '@/features/member/hooks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  ErrorState,
  Money,
  PageHeader,
} from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { Contribution } from '@/shared/types/contribution';
import { ManualContributionForm } from '../components/ManualContributionForm';
import { useAllContributions } from '../hooks';

function useColumns(): ColumnDef<Contribution, unknown>[] {
  const { data: members } = useMembers();
  const nameByMemberId = new Map(members?.map((m) => [m.id, m.fullName]));

  return [
    {
      accessorKey: 'contributionDate',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.contributionDate),
    },
    {
      id: 'member',
      header: 'Member',
      cell: ({ row }) => nameByMemberId.get(row.original.memberId) ?? row.original.memberId,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <Money amount={row.original.amount} />,
    },
    { accessorKey: 'source', header: 'Source' },
    { accessorKey: 'reference', header: 'Reference' },
  ];
}

export function AdminContributionsScreen() {
  const { data, isLoading, isError, refetch } = useAllContributions();
  const columns = useColumns();

  return (
    <div>
      <PageHeader title="Contributions" description="Record manual contributions and browse all." />

      <p className="mb-4 rounded-control bg-warning-muted px-3 py-2 text-xs text-warning">
        The backend doesn't expose an all-contributions endpoint yet. This table is backed by
        seed data until that lands.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record a manual contribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ManualContributionForm />
        </CardContent>
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          emptyTitle="No contributions recorded"
          emptyDescription="Contributions recorded manually or via Paystack will show up here."
          emptyIcon={PiggyBank}
          searchPlaceholder="Search contributions…"
        />
      )}
    </div>
  );
}
