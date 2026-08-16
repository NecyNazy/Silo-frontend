import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { useApproveLoanRequest } from '../hooks';
import {
  approveLoanRequestSchema,
  type ApproveLoanRequestFormValues,
  type ApproveLoanRequestSubmitValues,
} from '../schemas';

export function ApproveRequestDialog({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useApproveLoanRequest(requestId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApproveLoanRequestFormValues, unknown, ApproveLoanRequestSubmitValues>({
    resolver: zodResolver(approveLoanRequestSchema),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Approve</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve loan request</DialogTitle>
          <DialogDescription>
            Set the terms — this creates the loan and its installment schedule.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) =>
            mutation.mutate(values, { onSuccess: () => setOpen(false) }),
          )}
        >
          <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />

          <div className="space-y-1.5">
            <Label htmlFor="interestRate">Interest rate (%)</Label>
            <Input id="interestRate" type="number" min={0} step="0.1" {...register('interestRate')} />
            {errors.interestRate && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                {errors.interestRate.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="durationMonths">Duration (months)</Label>
            <Input id="durationMonths" type="number" min={1} {...register('durationMonths')} />
            {errors.durationMonths && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                {errors.durationMonths.message}
              </p>
            )}
          </div>

          <Button type="submit" isLoading={mutation.isPending}>
            Confirm approval
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
