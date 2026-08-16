import { Link } from 'react-router-dom';
import { useMyLoans } from '@/features/loan/hooks';
import { useMyProfile } from '@/features/member/hooks';
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
import { CardSkeleton } from '@/shared/components/Skeleton';
import { useMemberReportSummary } from '../hooks';

export function MemberDashboardScreen() {
  const {
    data: member,
    isLoading: memberLoading,
    isError: memberError,
    refetch: refetchMember,
  } = useMyProfile();
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useMemberReportSummary(member?.id);
  const {
    data: loans,
    isLoading: loansLoading,
    isError: loansError,
    refetch: refetchLoans,
  } = useMyLoans();

  const activeLoan = loans?.find((l) => l.status === 'ACTIVE');

  if (memberLoading || (member && (summaryLoading || loansLoading))) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (memberError || summaryError || loansError) {
    return (
      <ErrorState
        onRetry={() => {
          refetchMember();
          refetchSummary();
          refetchLoans();
        }}
      />
    );
  }

  return (
    <div>
      <PageHeader title={`Welcome back${member ? `, ${member.fullName}` : ''}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total contributed</CardTitle>
          </CardHeader>
          <CardContent>
            <Money
              amount={summary?.totalContributions ?? 0}
              className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active loans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {summary?.activeLoans ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total repaid</CardTitle>
          </CardHeader>
          <CardContent>
            <Money
              amount={summary?.totalRepayments ?? 0}
              className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outstanding balance</CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoan ? (
              <Link
                to={`/loans/${activeLoan.id}`}
                className="text-2xl font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
              >
                <Money amount={activeLoan.outstandingBalance} />
              </Link>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">None</p>
            )}
          </CardContent>
        </Card>
      </div>

      {member && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          Account status: <StatusBadge status={member.status} /> KYC:{' '}
          <StatusBadge status={member.kycStatus} />
        </div>
      )}
    </div>
  );
}
