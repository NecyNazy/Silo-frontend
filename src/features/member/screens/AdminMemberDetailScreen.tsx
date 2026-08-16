import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
} from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatDate } from '@/shared/lib/date';
import type { MemberStatus } from '@/shared/types/member';
import { useMember, useUpdateKycStatus, useUpdateMemberStatus } from '../hooks';

const STATUS_OPTIONS: MemberStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

export function AdminMemberDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const { data: member, isLoading, isError, refetch } = useMember(id);
  const kycMutation = useUpdateKycStatus(id as string);
  const statusMutation = useUpdateMemberStatus(id as string);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !member) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title={member.fullName} description={member.email} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>KYC review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Current status:</span>
              <StatusBadge status={member.kycStatus} />
            </div>
            {member.idDocumentRef ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ID document on file: {member.idDocumentRef}
              </p>
            ) : (
              <p className="text-sm text-amber-700 dark:text-amber-400">
                No ID document uploaded yet.
              </p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                isLoading={kycMutation.isPending}
                onClick={() => kycMutation.mutate('VERIFIED')}
                disabled={member.kycStatus === 'VERIFIED'}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                isLoading={kycMutation.isPending}
                onClick={() => kycMutation.mutate('REJECTED')}
                disabled={member.kycStatus === 'REJECTED'}
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Current status:</span>
              <StatusBadge status={member.status} />
            </div>
            <Select
              value={member.status}
              onValueChange={(value) => statusMutation.mutate(value as MemberStatus)}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p>Phone: {member.phoneNumber}</p>
            {member.idType && (
              <p>
                ID: {member.idType} {member.idNumber}
              </p>
            )}
            <p>Member since: {formatDate(member.joinedDate)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
