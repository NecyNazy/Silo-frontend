import { useParams } from 'react-router-dom';
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
import { useLoan } from '../hooks';

export function AdminLoanDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const { data: loan, isLoading, isError, refetch } = useLoan(id);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (isError || !loan) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader
        title={`${loan.memberName} — Loan ${loan.id}`}
        action={<StatusBadge status={loan.status} />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <Money amount={loan.principal} className="text-2xl font-semibold text-slate-900 dark:text-slate-100" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Outstanding balance</CardTitle>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Guarantors</CardTitle>
        </CardHeader>
        <CardContent>
          <GuarantorList guarantors={loan.guarantors} />
        </CardContent>
      </Card>

      {loan.status === 'DEFAULTED' && (
        <Card>
          <CardHeader>
            <CardTitle>Guarantor liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Liability breakdown is coming in Phase 2, once the default sweep job is live.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
