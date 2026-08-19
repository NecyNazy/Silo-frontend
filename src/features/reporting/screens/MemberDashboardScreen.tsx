import type { ColumnDef } from '@tanstack/react-table';
import { PiggyBank } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AutoDebitCard } from '@/features/contribution/components/AutoDebitCard';
import { ContributionCta } from '@/features/contribution/components/ContributionCta';
import { useContributionSummary, useMemberContributions } from '@/features/contribution/hooks';
import { useMyLoans } from '@/features/loan/hooks';
import { useMyProfile } from '@/features/member/hooks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  ErrorState,
  Money,
  PageHeader,
  StatusBadge,
} from '@/shared/components';
import { CardSkeleton } from '@/shared/components/Skeleton';
import { formatDate } from '@/shared/lib/date';
import { fadeInUp, staggerChildren } from '@/shared/lib/motion';
import type { Contribution } from '@/shared/types/contribution';
import { useMemberReportSummary } from '../hooks';

const contributionColumns: ColumnDef<Contribution, unknown>[] = [
  {
    accessorKey: 'contributionDate',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.contributionDate),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <Money amount={row.original.amount} />,
  },
  { accessorKey: 'source', header: 'Source' },
  { accessorKey: 'reference', header: 'Reference' },
];

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
  const { data: contributionSummary } = useContributionSummary(member?.id);
  const {
    data: contributions,
    isLoading: contributionsLoading,
    isError: contributionsError,
    refetch: refetchContributions,
  } = useMemberContributions(member?.id);

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

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerChildren(0.08)}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Total contributed</CardTitle>
            </CardHeader>
            <CardContent>
              <Money
                amount={summary?.totalContributions ?? 0}
                className="text-2xl font-semibold text-text-primary"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Active loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-text-primary">
                {summary?.activeLoans ?? 0}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Total repaid</CardTitle>
            </CardHeader>
            <CardContent>
              <Money
                amount={summary?.totalRepayments ?? 0}
                className="text-2xl font-semibold text-text-primary"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Outstanding balance</CardTitle>
            </CardHeader>
            <CardContent>
              {activeLoan ? (
                <Link
                  to={`/loans/${activeLoan.id}`}
                  className="text-2xl font-semibold text-accent hover:underline"
                >
                  <Money amount={activeLoan.outstandingBalance} />
                </Link>
              ) : (
                <p className="text-sm text-text-muted">None</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {member && (
        <div className="mt-6 flex items-center gap-2 text-sm text-text-muted">
          Account status: <StatusBadge status={member.status} /> KYC:{' '}
          <StatusBadge status={member.kycStatus} />
        </div>
      )}

      <div className="mt-10">
        <PageHeader title="Contributions" description="Your contribution history and running total." />

        {member && member.status === 'ACTIVE' && member.kycStatus === 'VERIFIED' ? (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contribute now</CardTitle>
              </CardHeader>
              <CardContent>
                <ContributionCta email={member.email} />
              </CardContent>
            </Card>
            <AutoDebitCard />
          </div>
        ) : (
          <p className="mb-6 text-sm text-text-muted">
            Contributions unlock once your KYC is verified and your account is active.
          </p>
        )}

        {contributionsError ? (
          <ErrorState onRetry={() => refetchContributions()} />
        ) : (
          <DataTable
            columns={contributionColumns}
            data={contributions ?? []}
            isLoading={contributionsLoading}
            emptyTitle="No contributions yet"
            emptyDescription="Once you contribute, manually or via Paystack, your history shows up here."
            emptyIcon={PiggyBank}
            searchPlaceholder="Search contributions…"
          />
        )}
        {contributionSummary && contributionSummary.contributionCount > 0 && (
          <p className="mt-2 text-xs text-text-muted">
            {contributionSummary.contributionCount} contribution
            {contributionSummary.contributionCount === 1 ? '' : 's'} total.
          </p>
        )}
      </div>
    </div>
  );
}
