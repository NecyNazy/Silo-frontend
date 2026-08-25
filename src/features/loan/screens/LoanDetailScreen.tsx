import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
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
import type { LoanDetail, RiskTier } from '@/shared/types/loan';
import { GuarantorList } from '../components/GuarantorList';
import { InstallmentSchedule } from '../components/InstallmentSchedule';
import { useLoanOrRequest, useLoanRequest } from '../hooks';

export function LoanDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const currentMemberId = useAuthStore((s) => s.memberId);
  const location = useLocation();
  const borrowerRiskTier = (location.state as { borrowerRiskTier?: RiskTier } | null)
    ?.borrowerRiskTier;
  const result = useLoanOrRequest(id);
  const requesterId = result.kind === 'request' ? result.request.memberId : undefined;
  const { data: requester } = useMember(requesterId);

  if (result.isLoading) return <Skeleton className="h-64 w-full" />;
  if (result.isError || !result.kind) return <ErrorState message="Loan not found." />;

  if (result.kind === 'request') {
    const { request } = result;
    const isOwnRequest = request.memberId === currentMemberId;

    return (
      <div>
        <PageHeader
          title={`Loan request: ${request.purpose}`}
          action={<StatusBadge status={request.status} />}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Amount requested</CardTitle>
            </CardHeader>
            <CardContent>
              <Money
                amount={request.amountRequested}
                className="text-2xl font-semibold text-text-primary"
              />
            </CardContent>
          </Card>
          {!isOwnRequest && (
            <Card>
              <CardHeader>
                <CardTitle>Requester</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm text-text-secondary">
                <p>{requester?.fullName ?? request.memberId}</p>
                {borrowerRiskTier && (
                  <p className="flex items-center gap-2">
                    Risk tier <StatusBadge status={borrowerRiskTier} />
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Guarantors</CardTitle>
              {request.status === 'PENDING' && isOwnRequest && (
                <Button asChild size="sm" variant="outline">
                  <Link to={`/loans/${request.id}/guarantors/add`}>Add guarantor</Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <GuarantorList guarantors={request.guarantors} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <LoanDetailBody loan={result.loan} />;
}

function LoanDetailBody({ loan }: { loan: LoanDetail }) {
  const requestResult = useLoanRequest(loan.loanRequestId);

  return (
    <div>
      <PageHeader
        title={`Loan ${loan.id}`}
        description={`Disbursed with ${loan.interestRate}% interest over ${loan.durationMonths} months`}
        action={<StatusBadge status={loan.status} />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <Money
              amount={loan.principalAmount}
              className="text-2xl font-semibold text-text-primary"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Outstanding balance</CardTitle>
            {loan.status === 'ACTIVE' && (
              <Button asChild size="sm">
                <Link to={`/loans/${loan.id}/repay`}>Make a repayment</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Money
              amount={loan.outstandingBalance}
              className="text-2xl font-semibold text-text-primary"
            />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">
          Repayment schedule
        </h2>
        <InstallmentSchedule installments={loan.installments} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guarantors</CardTitle>
        </CardHeader>
        <CardContent>
          {requestResult.data ? (
            <GuarantorList guarantors={requestResult.data.guarantors} />
          ) : (
            <p className="text-sm text-text-muted">
              Guarantor info isn't available for this loan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
