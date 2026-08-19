import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, PageHeader } from '@/shared/components';
import type { LoanGuarantor } from '@/shared/types/loan';
import { GuarantorPicker } from '../components/GuarantorPicker';

export function AddGuarantorScreen() {
  const { id } = useParams<{ id: string }>();
  const [invited, setInvited] = useState<LoanGuarantor[]>([]);

  return (
    <div>
      <PageHeader
        title="Add a guarantor"
        description="Candidates are shown with their credit score so you can judge fit."
      />

      <div className="max-w-md space-y-4">
        <GuarantorPicker
          loanRequestId={id as string}
          invited={invited}
          onInvited={(guarantor) => setInvited((prev) => [...prev, guarantor])}
        />

        <Button asChild variant="outline">
          <Link to={`/loans/${id}`}>Done</Link>
        </Button>
      </div>
    </div>
  );
}
