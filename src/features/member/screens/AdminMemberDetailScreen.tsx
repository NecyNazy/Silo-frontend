import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  FormAlert,
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
import { getErrorMessage } from '@/shared/lib/error';
import type { MemberStatus } from '@/shared/types/member';
import { useMember, useUpdateKycStatus, useUpdateMemberStatus } from '../hooks';

const STATUS_OPTIONS: MemberStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

export function AdminMemberDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const officerId = useAuthStore((s) => s.memberId);
  const { data: member, isLoading, isError, refetch } = useMember(id);
  const kycMutation = useUpdateKycStatus(id as string);
  const statusMutation = useUpdateMemberStatus(id as string);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !member) return <ErrorState onRetry={() => refetch()} />;

  const isOwnProfile = member.id === officerId;

  return (
    <div>
      <PageHeader title={member.fullName} description={member.email} />

      {isOwnProfile && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          This is your own profile. Another officer needs to change your KYC or account status.
        </p>
      )}

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
            <FormAlert message={kycMutation.isError ? getErrorMessage(kycMutation.error) : null} />
            <div className="flex gap-2">
              <Button
                size="sm"
                isLoading={kycMutation.isPending && kycMutation.variables === 'VERIFIED'}
                onClick={() => kycMutation.mutate('VERIFIED')}
                disabled={isOwnProfile || member.kycStatus === 'VERIFIED' || kycMutation.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                isLoading={kycMutation.isPending && kycMutation.variables === 'REJECTED'}
                onClick={() => kycMutation.mutate('REJECTED')}
                disabled={isOwnProfile || member.kycStatus === 'REJECTED' || kycMutation.isPending}
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
            <FormAlert
              message={statusMutation.isError ? getErrorMessage(statusMutation.error) : null}
            />
            <Select
              value={member.status}
              onValueChange={(value) => statusMutation.mutate(value as MemberStatus)}
              disabled={isOwnProfile || statusMutation.isPending}
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
