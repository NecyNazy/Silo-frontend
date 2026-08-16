import { Card, CardContent, CardHeader, CardTitle, ErrorState, PageHeader, StatusBadge } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { useMyProfile } from '../hooks';
import { ProfileForm } from '../components/ProfileForm';
import { IdDocumentUpload } from '../components/IdDocumentUpload';

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
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Status</CardTitle>
              <div className="flex gap-2">
                <StatusBadge status={member.status} />
                <StatusBadge status={member.kycStatus} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Credit score:{' '}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {member.creditScore}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm member={member} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Identity document</CardTitle>
            </CardHeader>
            <CardContent>
              <IdDocumentUpload member={member} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
