import { useMyProfile } from '../hooks';
import { Skeleton } from '@/shared/components/Skeleton';
import { ProfileForm } from '../components/ProfileForm';
import { Card, CardContent, CardHeader, CardTitle, ErrorState, PageHeader, StatusBadge } from '@/shared/components';

export function ProfileScreen() {
  const { data: member, isLoading, isError, refetch } = useMyProfile();

  return (
    <div>
      <PageHeader title="Profile" description="Your account details and KYC status." />

      {isLoading && <Skeleton className="h-64 w-full" />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {member && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between mb-6">
              <CardTitle>Status</CardTitle>
              <div className="flex gap-2">
                <StatusBadge status={member.status} />
                <StatusBadge status={member.kycStatus} />
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm member={member} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
