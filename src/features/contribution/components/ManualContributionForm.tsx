import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useAuthStore } from '@/features/auth/store';
import { useMembers } from '@/features/member/hooks';
import {
  Button,
  FormAlert,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useRecordManualContribution } from '../hooks';
import {
  manualContributionSchema,
  type ManualContributionFormValues,
  type ManualContributionSubmitValues,
} from '../schemas';

export function ManualContributionForm() {
  const officerId = useAuthStore((s) => s.memberId);
  const { data: members } = useMembers();
  const eligibleMembers = members?.filter((member) => member.id !== officerId);
  const mutation = useRecordManualContribution();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualContributionFormValues, unknown, ManualContributionSubmitValues>({
    resolver: zodResolver(manualContributionSchema),
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) =>
        mutation.mutate(values, {
          onSuccess: () => reset({ memberId: '', amount: 0, reference: '' }),
        }),
      )}
    >
      <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />

      <div className="space-y-1.5">
        <Label htmlFor="memberId">Member</Label>
        <Controller
          control={control}
          name="memberId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="memberId" className="max-w-sm">
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {eligibleMembers?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.memberId && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.memberId.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount (NGN)</Label>
        <Input id="amount" type="number" min={1} className="max-w-xs" {...register('amount')} />
        {errors.amount && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.amount.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reference">Reference</Label>
        <Input id="reference" className="max-w-sm" {...register('reference')} />
        {errors.reference && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.reference.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={mutation.isPending}>
        Record contribution
      </Button>
      {mutation.isSuccess && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">Contribution recorded.</p>
      )}
    </form>
  );
}
