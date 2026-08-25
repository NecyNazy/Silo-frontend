import { FileText } from 'lucide-react';
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
import { isPdf } from '@/shared/lib/file';
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
        <p className="mb-4 rounded-control bg-warning-muted px-3 py-2 text-sm text-warning">
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
              <span className="text-sm text-text-muted">Current status:</span>
              <StatusBadge status={member.kycStatus} />
            </div>
            {member.idDocumentRef ? (
              isPdf(member.idDocumentRef) ? (
                <a
                  href={member.idDocumentRef}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-control border border-border-subtle bg-surface-raised px-3 py-2 text-sm font-medium text-accent hover:underline"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  View ID document (PDF)
                </a>
              ) : (
                <a href={member.idDocumentRef} target="_blank" rel="noreferrer" className="block w-fit">
                  <img
                    src={member.idDocumentRef}
                    alt="Uploaded ID document"
                    className="max-h-64 rounded-control border border-border-subtle object-cover"
                  />
                </a>
              )
            ) : (
              <p className="text-sm text-warning">No ID document uploaded yet.</p>
            )}
            {member.idType && (
              <p className="text-sm text-text-muted">
                Declared ID: {member.idType} {member.idNumber}
              </p>
            )}
            <FormAlert message={kycMutation.isError ? getErrorMessage(kycMutation.error) : null} />
            <div className="flex gap-2">
              <Button
                size="sm"
                isLoading={kycMutation.isPending && kycMutation.variables === 'VERIFIED'}
                onClick={() => kycMutation.mutate('VERIFIED')}
                disabled={isOwnProfile || member.kycStatus !== 'PENDING' || kycMutation.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                isLoading={kycMutation.isPending && kycMutation.variables === 'REJECTED'}
                onClick={() => kycMutation.mutate('REJECTED')}
                disabled={isOwnProfile || member.kycStatus !== 'PENDING' || kycMutation.isPending}
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
              <span className="text-sm text-text-muted">Current status:</span>
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
          <CardContent className="space-y-2 text-sm text-text-secondary">
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
