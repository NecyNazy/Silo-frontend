import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, EmptyState, Money, StatusBadge } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { fadeInUp, staggerChildren } from '@/shared/lib/motion';
import { useGuarantorInvites, useRespondToGuarantorInvite } from '../hooks';

export function GuarantorInvitesList() {
  const { data: invites, isLoading } = useGuarantorInvites();
  const respondMutation = useRespondToGuarantorInvite();

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  if ((invites?.length ?? 0) === 0) {
    return (
      <EmptyState
        title="No pending invites"
        description="When someone asks you to guarantee their loan, it shows up here."
        icon={ShieldCheck}
      />
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={staggerChildren(0.06)} className="space-y-3">
      {invites?.map((invite) => (
        <motion.div key={invite.id} variants={fadeInUp}>
          <Card>
            <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  to={`/loans/${invite.loanRequestId}`}
                  state={{ borrowerRiskTier: invite.borrowerRiskTier }}
                  className="font-medium text-text-primary hover:text-accent hover:underline"
                >
                  {invite.purpose}
                </Link>
                <p className="text-sm text-text-muted">
                  Requesting <Money amount={invite.amountRequested} className="inline" />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={invite.borrowerRiskTier} />
                <Button
                  size="sm"
                  isLoading={respondMutation.isPending}
                  onClick={() => respondMutation.mutate({ guarantorId: invite.id, action: 'accept' })}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={respondMutation.isPending}
                  onClick={() => respondMutation.mutate({ guarantorId: invite.id, action: 'decline' })}
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
