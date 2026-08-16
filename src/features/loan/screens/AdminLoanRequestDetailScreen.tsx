import { useParams } from 'react-router-dom';
import { useMember } from '@/features/member/hooks';
import {
  Button,
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
import { GuarantorList } from '../components/GuarantorList';
import { RejectRequestDialog } from '../components/RejectRequestDialog';
import { useApproveLoanRequest, useLoanRequest } from '../hooks';

export function AdminLoanRequestDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading, isError, refetch } = useLoanRequest(id);
  const { data: member } = useMember(request?.memberId);
  const approveMutation = useApproveLoanRequest(id as string);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !request) return <ErrorState onRetry={() => refetch()} />;

  const acceptedGuarantors = request.guarantors.filter((g) => g.status === 'ACCEPTED');
  const canApprove = request.status === 'PENDING' && acceptedGuarantors.length > 0;

  return (
    <div>
      <PageHeader
        title={`${request.memberName} — ${request.purpose}`}
        action={<StatusBadge status={request.status} />}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>
              Amount: <Money amount={request.amount} className="inline" />
            </p>
            <p>Term: {request.termMonths} months</p>
            <p>Purpose: {request.purpose}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk & credibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Requester credit score: {member?.creditScore ?? '—'}</p>
            <p>KYC status: {member ? <StatusBadge status={member.kycStatus} /> : '—'}</p>
            <p>
              Accepted guarantors: {acceptedGuarantors.length} of {request.guarantors.length}{' '}
              invited
            </p>
            {!canApprove && request.status === 'PENDING' && (
              <p className="text-amber-700">
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
            <GuarantorList guarantors={request.guarantors} />
          </CardContent>
        </Card>
      </div>

      {request.status === 'PENDING' && (
        <div className="mt-6 flex gap-2">
          <Button
            isLoading={approveMutation.isPending}
            disabled={!canApprove}
            onClick={() => approveMutation.mutate()}
          >
            Approve
          </Button>
          <RejectRequestDialog requestId={request.id} />
        </div>
      )}
    </div>
  );
}
