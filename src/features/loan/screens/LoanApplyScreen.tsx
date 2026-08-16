import { PageHeader } from '@/shared/components';
import { LoanApplyForm } from '../components/LoanApplyForm';

export function LoanApplyScreen() {
  return (
    <div>
      <PageHeader
        title="Apply for a loan"
        description="You'll need at least one accepted guarantor before this can be reviewed."
      />
      <LoanApplyForm />
    </div>
  );
}
