import type { ColumnDef } from '@tanstack/react-table';
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
import { ManualContributionForm } from '../components/ManualContributionForm';
import { useAllContributions } from '../hooks';

const columns: ColumnDef<Contribution, unknown>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  { accessorKey: 'memberName', header: 'Member' },
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

export function AdminContributionsScreen() {
  const { data, isLoading } = useAllContributions();

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

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyTitle="No contributions recorded"
        searchPlaceholder="Search contributions…"
      />
    </div>
  );
}
