import { motion } from 'motion/react';
import { useAuthStore } from '@/features/auth/store';
import { OfficerStatusCard } from '@/features/officerApplication/components/OfficerStatusCard';
import { Card, CardContent, CardHeader, CardTitle, ErrorState, PageHeader, StatusBadge } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatDate } from '@/shared/lib/date';
import { fadeInUp, staggerChildren } from '@/shared/lib/motion';
import { EditProfileDialog } from '../components/EditProfileDialog';
import { KycDocumentCard } from '../components/KycDocumentCard';
import { useMyProfile } from '../hooks';

export function ProfileScreen() {
  const { data: member, isLoading, isError, refetch } = useMyProfile();
  const role = useAuthStore((s) => s.role);

  return (
    <div>
      <PageHeader title="Profile" description="Your account details and KYC status." />

      {isLoading && <Skeleton className="h-64 w-full" />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {member && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerChildren(0.08)}
          className="space-y-4"
        >
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle>{member.fullName}</CardTitle>
                  <p className="mt-1 text-sm text-text-muted">{member.email}</p>
                </div>
                <EditProfileDialog member={member} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={member.status} />
                  <StatusBadge status={member.kycStatus} />
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-text-muted">Phone</dt>
                    <dd className="text-text-primary">{member.phoneNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Member since</dt>
                    <dd className="text-text-primary">{formatDate(member.joinedDate)}</dd>
                  </div>
                  {member.idType && (
                    <div>
                      <dt className="text-text-muted">ID type</dt>
                      <dd className="text-text-primary">{member.idType}</dd>
                    </div>
                  )}
                  {member.idNumber && (
                    <div>
                      <dt className="text-text-muted">ID number</dt>
                      <dd className="text-text-primary">{member.idNumber}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <KycDocumentCard member={member} />
          </motion.div>

          {role === 'MEMBER' && (
            <motion.div variants={fadeInUp}>
              <OfficerStatusCard />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
