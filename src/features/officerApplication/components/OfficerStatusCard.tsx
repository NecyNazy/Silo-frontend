import { UserCog } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, FormAlert, StatusBadge } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { getErrorMessage } from '@/shared/lib/error';
import { useApplyForOfficer, useMyOfficerApplications } from '../hooks';

export function OfficerStatusCard() {
  const { data: applications, isLoading } = useMyOfficerApplications();
  const applyMutation = useApplyForOfficer();

  const latest = applications?.[applications.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Officer status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-8 w-40" />
        ) : latest ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Application status:</span>
            <StatusBadge status={latest.status} />
          </div>
        ) : (
          <>
            <p className="text-sm text-text-muted">
              Officers approve/reject loan requests, record manual contributions, and manage
              member KYC. Becoming one needs sign-off from existing officers.
            </p>
            <FormAlert message={applyMutation.isError ? getErrorMessage(applyMutation.error) : null} />
            <Button
              variant="outline"
              size="sm"
              isLoading={applyMutation.isPending}
              onClick={() => applyMutation.mutate()}
            >
              <UserCog className="h-4 w-4" aria-hidden="true" />
              Apply to become an officer
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
