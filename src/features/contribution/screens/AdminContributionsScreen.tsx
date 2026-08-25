import type { ColumnDef } from '@tanstack/react-table';
import { PiggyBank, Zap } from 'lucide-react';
import { useMembers } from '@/features/member/hooks';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  ErrorState,
  FormAlert,
  Money,
  PageHeader,
} from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import { getErrorMessage } from '@/shared/lib/error';
import type { Contribution } from '@/shared/types/contribution';
import { ManualContributionForm } from '../components/ManualContributionForm';
import { useAllContributions, useRunAutoDebitSweep } from '../hooks';

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
  const sweepMutation = useRunAutoDebitSweep();

  return (
    <div>
      <PageHeader title="Contributions" description="Record manual contributions and browse all." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record a manual contribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ManualContributionForm />
        </CardContent>
      </Card>

      <Card className="mb-6 border-warning/30">
        <CardHeader>
          <CardTitle>Auto-debit sweep (demo only)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-text-muted">
            Fires the nightly auto-debit cron on demand instead of waiting for 2am. Temporary
            endpoint for this demo — will be removed once the real schedule is enough to test
            against.
          </p>
          <FormAlert
            message={sweepMutation.isError ? getErrorMessage(sweepMutation.error) : null}
          />
          {sweepMutation.isSuccess && (
            <p className="text-sm text-success">Sweep ran. Mandates refreshed below.</p>
          )}
          <Button
            size="sm"
            variant="outline"
            isLoading={sweepMutation.isPending}
            onClick={() => sweepMutation.mutate()}
          >
            <Zap className="h-4 w-4" aria-hidden="true" />
            Run sweep now
          </Button>
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
