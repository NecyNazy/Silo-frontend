import { useParams } from 'react-router-dom';
import { useMember } from '@/features/member/hooks';
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
  const { data: request, isLoading, isError, refetch } = useLoanRequest(id);
  const { data: member } = useMember(request?.memberId);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !request) return <ErrorState onRetry={() => refetch()} />;

  const acceptedGuarantors = request.guarantors.filter((g) => g.status === 'ACCEPTED');
  const canApprove = request.status === 'PENDING' && acceptedGuarantors.length > 0;

  return (
    <div>
      <PageHeader title={request.purpose} action={<StatusBadge status={request.status} />} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p>
              Amount: <Money amount={request.amountRequested} className="inline" />
            </p>
            <p>Purpose: {request.purpose}</p>
            <p>Member: {request.memberId}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk & credibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <p>KYC status: {member ? <StatusBadge status={member.kycStatus} /> : '—'}</p>
            <p>Account status: {member ? <StatusBadge status={member.status} /> : '—'}</p>
            <p>
              Accepted guarantors: {acceptedGuarantors.length} of {request.guarantors.length}{' '}
              invited
            </p>
            {!canApprove && request.status === 'PENDING' && (
              <p className="text-amber-700 dark:text-amber-400">
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
          {canApprove ? (
            <ApproveRequestDialog requestId={request.id} />
          ) : (
            <span
              title="Needs at least one accepted guarantor"
              className="inline-flex h-10 cursor-not-allowed items-center rounded-md bg-slate-200 px-4 text-sm font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-600"
            >
              Approve
            </span>
          )}
          <RejectRequestDialog requestId={request.id} />
        </div>
      )}
    </div>
  );
}
