import { useMyProfile } from '@/features/member/hooks';
import { PageHeader } from '@/shared/components';
import { LoanApplyForm } from '../components/LoanApplyForm';

export function LoanApplyScreen() {
  const { data: member } = useMyProfile();
  const canApply = member?.status === 'ACTIVE' && member?.kycStatus === 'VERIFIED';

  return (
    <div>
      <PageHeader
        title="Apply for a loan"
        description="You'll need at least one accepted guarantor before this can be reviewed."
      />
      {member && !canApply ? (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Your account must be active and your KYC verified before you can request a loan.
        </p>
      ) : (
        <LoanApplyForm />
      )}
    </div>
  );
}
