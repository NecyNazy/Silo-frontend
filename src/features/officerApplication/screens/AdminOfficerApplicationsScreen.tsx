import type { ColumnDef } from '@tanstack/react-table';
import { UserCog } from 'lucide-react';
import { useMembers } from '@/features/member/hooks';
import { Button, DataTable, ErrorState, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { OfficerApplication } from '@/shared/types/officerApplication';
import {
  useApproveOfficerApplication,
  usePendingOfficerApplications,
  useRejectOfficerApplication,
} from '../hooks';

export function AdminOfficerApplicationsScreen() {
  const { data, isLoading, isError, refetch } = usePendingOfficerApplications();
  const { data: members } = useMembers();
  const approveMutation = useApproveOfficerApplication();
  const rejectMutation = useRejectOfficerApplication();

  const memberNames = new Map(members?.map((m) => [m.id, m.fullName]));

  const columns: ColumnDef<OfficerApplication, unknown>[] = [
    {
      id: 'member',
      header: 'Member',
      accessorFn: (row) => memberNames.get(row.memberId) ?? row.memberId,
    },
    {
      accessorKey: 'approvalCount',
      header: 'Approvals so far',
      cell: ({ row }) => row.original.approvalCount,
    },
    {
      accessorKey: 'createdAt',
      header: 'Applied',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const application = row.original;
        const busy =
          (approveMutation.isPending && approveMutation.variables === application.id) ||
          (rejectMutation.isPending && rejectMutation.variables === application.id);

        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              isLoading={approveMutation.isPending && approveMutation.variables === application.id}
              disabled={application.approvedByCaller || busy}
              title={application.approvedByCaller ? 'You already approved this application' : undefined}
              onClick={() => approveMutation.mutate(application.id)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              isLoading={rejectMutation.isPending && rejectMutation.variables === application.id}
              disabled={busy}
              onClick={() => rejectMutation.mutate(application.id)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Officer applications"
        description="Members who've applied to become officers. Two distinct officers must approve (fewer while the cooperative is still bootstrapping)."
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          emptyTitle="No pending applications"
          emptyDescription="Members applying to become officers will show up here."
          emptyIcon={UserCog}
          searchPlaceholder="Search applications…"
        />
      )}
    </div>
  );
}
