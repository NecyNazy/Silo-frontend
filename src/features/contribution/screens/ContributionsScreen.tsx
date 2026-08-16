import type { ColumnDef } from '@tanstack/react-table';
import { useMyProfile } from '@/features/member/hooks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Money,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { Contribution } from '@/shared/types/contribution';
import { ContributionCta } from '../components/ContributionCta';
import { useContributionSummary, useMemberContributions } from '../hooks';

const columns: ColumnDef<Contribution, unknown>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <Money amount={row.original.amount} />,
  },
  { accessorKey: 'method', header: 'Method' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export function ContributionsScreen() {
  const { data: member } = useMyProfile();
  const { data: summary } = useContributionSummary(member?.id);
  const { data: contributions, isLoading } = useMemberContributions(member?.id);

  return (
    <div>
      <PageHeader title="Contributions" description="Your contribution history and running total." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total contributed</CardTitle>
          </CardHeader>
          <CardContent>
            <Money
              amount={summary?.totalContributed ?? 0}
              className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contribute now</CardTitle>
          </CardHeader>
          <CardContent>
            {member && member.status === 'ACTIVE' && member.kycStatus === 'VERIFIED' ? (
              <ContributionCta email={member.email} />
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Contributions unlock once your KYC is verified and your account is active.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={contributions?.content ?? []}
        isLoading={isLoading}
        emptyTitle="No contributions yet"
        searchPlaceholder="Search contributions…"
      />
    </div>
  );
}
