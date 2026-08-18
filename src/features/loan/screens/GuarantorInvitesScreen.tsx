import { Button, Card, CardContent, EmptyState, Money, PageHeader, StatusBadge } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { useGuarantorInvites, useRespondToGuarantorInvite } from '../hooks';

export function GuarantorInvitesScreen() {
  const { data: invites, isLoading } = useGuarantorInvites();
  const respondMutation = useRespondToGuarantorInvite();

  return (
    <div>
      <PageHeader
        title="Guarantor invites"
        description="Requests where someone has asked you to guarantee their loan."
      />

      {isLoading && <Skeleton className="h-40 w-full" />}

      {!isLoading && (invites?.length ?? 0) === 0 && <EmptyState title="No pending invites" />}

      <div className="space-y-3">
        {invites?.map((invite) => (
          <Card key={invite.id}>
            <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {invite.purpose}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Requesting <Money amount={invite.amountRequested} className="inline" />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={invite.borrowerRiskTier} />
                <Button
                  size="sm"
                  isLoading={respondMutation.isPending}
                  onClick={() =>
                    respondMutation.mutate({ guarantorId: invite.id, action: 'accept' })
                  }
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={respondMutation.isPending}
                  onClick={() =>
                    respondMutation.mutate({ guarantorId: invite.id, action: 'decline' })
                  }
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
