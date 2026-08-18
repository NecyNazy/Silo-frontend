import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormAlert,
  Input,
  Label,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import type { LoanGuarantor, LoanRequest } from '@/shared/types/loan';
import { GuarantorPicker } from './GuarantorPicker';
import { useCreateLoanRequest } from '../hooks';
import {
  createLoanRequestSchema,
  type CreateLoanRequestFormValues,
  type CreateLoanRequestSubmitValues,
} from '../schemas';

export function LoanApplyDialog({
  disabled,
  disabledReason,
}: {
  disabled?: boolean;
  disabledReason?: string;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<LoanRequest | null>(null);
  const [invited, setInvited] = useState<LoanGuarantor[]>([]);
  const mutation = useCreateLoanRequest();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLoanRequestFormValues, unknown, CreateLoanRequestSubmitValues>({
    resolver: zodResolver(createLoanRequestSchema),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset once the close animation has room to finish, not mid-transition.
      setTimeout(() => {
        setRequest(null);
        setInvited([]);
        reset();
      }, 200);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled} title={disabled ? disabledReason : undefined}>
          Apply for a loan
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!request ? (
          <>
            <DialogHeader>
              <DialogTitle>Apply for a loan</DialogTitle>
              <DialogDescription>
                The interest rate and repayment term are set by an officer when your request is
                approved.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={handleSubmit((values) =>
                mutation.mutate(values, { onSuccess: (created) => setRequest(created) }),
              )}
            >
              <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />

              <div className="space-y-1.5">
                <Label htmlFor="amountRequested">Amount (NGN)</Label>
                <Input id="amountRequested" type="number" min={1} {...register('amountRequested')} />
                {errors.amountRequested && (
                  <p role="alert" className="text-xs text-danger">
                    {errors.amountRequested.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="purpose">Purpose</Label>
                <Input id="purpose" {...register('purpose')} />
                {errors.purpose && (
                  <p role="alert" className="text-xs text-danger">
                    {errors.purpose.message}
                  </p>
                )}
              </div>

              <Button type="submit" isLoading={mutation.isPending}>
                Continue to guarantors
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invite a guarantor</DialogTitle>
              <DialogDescription>
                Your request needs at least one accepted guarantor before an officer can approve
                it. You can invite more than one.
              </DialogDescription>
            </DialogHeader>

            <GuarantorPicker
              loanRequestId={request.id}
              invited={invited}
              onInvited={(guarantor) => setInvited((prev) => [...prev, guarantor])}
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  handleOpenChange(false);
                  navigate(`/loans/${request.id}`);
                }}
              >
                View request
              </Button>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
