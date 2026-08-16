import { Link, useParams } from 'react-router-dom';
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
import type { LoanDetail } from '@/shared/types/loan';
import { GuarantorList } from '../components/GuarantorList';
import { InstallmentSchedule } from '../components/InstallmentSchedule';
import { useLoanOrRequest, useLoanRequest } from '../hooks';

export function LoanDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const result = useLoanOrRequest(id);

  if (result.isLoading) return <Skeleton className="h-64 w-full" />;
  if (result.isError || !result.kind) return <ErrorState message="Loan not found." />;

  if (result.kind === 'request') {
    const { request } = result;
    return (
      <div>
        <PageHeader
          title={`Loan request — ${request.purpose}`}
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
                className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Guarantors</CardTitle>
              {request.status === 'PENDING' && (
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
        title={`Loan — ${loan.id}`}
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
              className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
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
              className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
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
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Guarantor info isn't available for this loan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
