import { useParams } from 'react-router-dom';
import { useMembers } from '@/features/member/hooks';
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
import { GuarantorList } from '../components/GuarantorList';
import { InstallmentSchedule } from '../components/InstallmentSchedule';
import { useLoan, useLoanRequest } from '../hooks';

export function AdminLoanDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const { data: loan, isLoading, isError, refetch } = useLoan(id);
  const requestResult = useLoanRequest(loan?.loanRequestId);
  const { data: members } = useMembers();
  const memberNames = new Map(members?.map((m) => [m.id, m.fullName]));

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !loan) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader
        title={memberNames.get(loan.memberId) ?? `Loan ${loan.id}`}
        description={memberNames.has(loan.memberId) ? `Loan ${loan.id}` : undefined}
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
          <CardHeader>
            <CardTitle>Outstanding balance</CardTitle>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Guarantors</CardTitle>
        </CardHeader>
        <CardContent>
          {requestResult.data ? (
            <GuarantorList guarantors={requestResult.data.guarantors} memberNames={memberNames} />
          ) : (
            <p className="text-sm text-text-muted">
              Guarantor info isn't available for this loan.
            </p>
          )}
        </CardContent>
      </Card>

      {loan.status === 'DEFAULTED' && (
        <Card>
          <CardHeader>
            <CardTitle>Guarantor liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">
              Liability breakdown is coming in Phase 2, once the default sweep job is live.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
