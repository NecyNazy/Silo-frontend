import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoan } from '@/features/loan/hooks';
import { Button, ErrorState, FormAlert, Input, Label, Money, PageHeader } from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { getErrorMessage } from '@/shared/lib/error';
import { useCreateRepayment } from '../hooks';
import { repaymentSchema, type RepaymentFormValues, type RepaymentSubmitValues } from '../schemas';

export function RepayScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: loan, isLoading, isError } = useLoan(id);
  const mutation = useCreateRepayment();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RepaymentFormValues, unknown, RepaymentSubmitValues>({
    resolver: zodResolver(repaymentSchema),
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (isError || !loan) return <ErrorState message="Loan not found." />;

  return (
    <div>
      <PageHeader title="Make a repayment" description={`Loan ${loan.id}`} />

      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        Outstanding balance: <Money amount={loan.outstandingBalance} className="inline font-medium" />
      </p>

      <form
        className="max-w-sm space-y-4"
        onSubmit={handleSubmit((values) =>
          mutation.mutate(
            { loanId: loan.id, amount: values.amount, reference: values.reference },
            { onSuccess: () => navigate(`/loans/${loan.id}`) },
          ),
        )}
      >
        <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />

        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (NGN)</Label>
          <Input id="amount" type="number" min={1} {...register('amount')} />
          {errors.amount && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reference">Reference</Label>
          <Input id="reference" {...register('reference')} />
          {errors.reference && (
            <p role="alert" className="text-xs text-red-600 dark:text-red-400">
              {errors.reference.message}
            </p>
          )}
        </div>

        <Button type="submit" isLoading={mutation.isPending}>
          Submit repayment
        </Button>
      </form>
    </div>
  );
}
