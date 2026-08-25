import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import { useMember, useMembers } from '@/features/member/hooks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  Money,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { ApproveRequestDialog } from '../components/ApproveRequestDialog';
import { GuarantorList } from '../components/GuarantorList';
import { RejectRequestDialog } from '../components/RejectRequestDialog';
import { useLoanRequest } from '../hooks';

export function AdminLoanRequestDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const officerId = useAuthStore((s) => s.memberId);
  const { data: request, isLoading, isError, refetch } = useLoanRequest(id);
  const { data: member } = useMember(request?.memberId);
  const { data: members } = useMembers();
  const memberNames = new Map(members?.map((m) => [m.id, m.fullName]));

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !request) return <ErrorState onRetry={() => refetch()} />;

  const acceptedGuarantors = request.guarantors.filter((g) => g.status === 'ACCEPTED');
  const isOwnRequest = request.memberId === officerId;
  const canApprove = request.status === 'PENDING' && acceptedGuarantors.length > 0 && !isOwnRequest;

  return (
    <div>
      <PageHeader title={request.purpose} action={<StatusBadge status={request.status} />} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-text-secondary">
            <p>
              Amount: <Money amount={request.amountRequested} className="inline" />
            </p>
            <p>Purpose: {request.purpose}</p>
            <p>Member: {member?.fullName ?? request.memberId}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk & credibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-text-secondary">
            <p>KYC status: {member ? <StatusBadge status={member.kycStatus} /> : 'Not available'}</p>
            <p>Account status: {member ? <StatusBadge status={member.status} /> : 'Not available'}</p>
            <p>
              Accepted guarantors: {acceptedGuarantors.length} of {request.guarantors.length}{' '}
              invited
            </p>
            {isOwnRequest && request.status === 'PENDING' && (
              <p className="text-warning">
                This is your own request. Another officer needs to approve or reject it.
              </p>
            )}
            {!isOwnRequest && !canApprove && request.status === 'PENDING' && (
              <p className="text-warning">
                Needs at least one accepted guarantor before it can be approved.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Guarantors</CardTitle>
          </CardHeader>
          <CardContent>
            <GuarantorList guarantors={request.guarantors} memberNames={memberNames} />
          </CardContent>
        </Card>
      </div>

      {request.status === 'PENDING' && (
        <div className="mt-6 flex gap-2">
          <ApproveRequestDialog
            requestId={request.id}
            disabled={!canApprove}
            disabledReason={
              isOwnRequest
                ? 'An officer cannot approve their own loan request'
                : 'Needs at least one accepted guarantor'
            }
          />
          <RejectRequestDialog
            requestId={request.id}
            disabled={isOwnRequest}
            disabledReason="An officer cannot reject their own loan request"
          />
        </div>
      )}
    </div>
  );
}
