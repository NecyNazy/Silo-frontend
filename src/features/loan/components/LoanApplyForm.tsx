import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, FormAlert, Input, Label } from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useCreateLoanRequest } from '../hooks';
import {
  createLoanRequestSchema,
  type CreateLoanRequestFormValues,
  type CreateLoanRequestSubmitValues,
} from '../schemas';

export function LoanApplyForm() {
  const navigate = useNavigate();
  const mutation = useCreateLoanRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLoanRequestFormValues, unknown, CreateLoanRequestSubmitValues>({
    resolver: zodResolver(createLoanRequestSchema),
  });

  return (
    <form
      className="max-w-md space-y-4"
      onSubmit={handleSubmit((values) =>
        mutation.mutate(values, {
          onSuccess: (request) => navigate(`/loans/${request.id}/guarantors/add`),
        }),
      )}
    >
      <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />

      <div className="space-y-1.5">
        <Label htmlFor="amountRequested">Amount (NGN)</Label>
        <Input id="amountRequested" type="number" min={1} {...register('amountRequested')} />
        {errors.amountRequested && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.amountRequested.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="purpose">Purpose</Label>
        <Input id="purpose" {...register('purpose')} />
        {errors.purpose && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.purpose.message}
          </p>
        )}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        The interest rate and repayment term are set by an officer when your request is approved.
      </p>

      <Button type="submit" isLoading={mutation.isPending}>
        Submit request
      </Button>
    </form>
  );
}
