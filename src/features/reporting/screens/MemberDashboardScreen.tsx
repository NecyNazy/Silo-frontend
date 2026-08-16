import { Link } from 'react-router-dom';
import { useContributionSummary } from '@/features/contribution/hooks';
import { useMyLoans } from '@/features/loan/hooks';
import { useMyProfile } from '@/features/member/hooks';
import { useNotifications } from '@/features/notification/hooks';
import { Card, CardContent, CardHeader, CardTitle, Money, PageHeader, StatusBadge } from '@/shared/components';
import { formatDate } from '@/shared/lib/date';

export function MemberDashboardScreen() {
  const { data: member } = useMyProfile();
  const { data: summary } = useContributionSummary(member?.id);
  const { data: loans } = useMyLoans();
  const { data: notifications } = useNotifications();

  const activeLoan = loans?.content.find((l) => l.status === 'ACTIVE');
  const nextInstallment = activeLoan?.installments.find((i) => i.status === 'PENDING');
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

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
              amount={summary?.totalContributed ?? 0}
              className="text-2xl font-semibold text-slate-900 dark:text-slate-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active loan</CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoan ? (
              <Link
                to={`/loans/${activeLoan.id}`}
                className="text-indigo-700 hover:underline dark:text-indigo-400"
              >
                <Money amount={activeLoan.outstandingBalance} className="text-2xl font-semibold" />
              </Link>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">None</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next installment</CardTitle>
          </CardHeader>
          <CardContent>
            {nextInstallment ? (
              <>
                <Money
                  amount={nextInstallment.amountDue}
                  className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Due {formatDate(nextInstallment.dueDate)}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Nothing due</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unread notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              to="/notifications"
              className="text-2xl font-semibold text-slate-900 hover:text-indigo-700 dark:text-slate-100 dark:hover:text-indigo-400"
            >
              {unreadCount}
            </Link>
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
