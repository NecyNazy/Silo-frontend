import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  FormAlert,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import type { LoanGuarantor } from '@/shared/types/loan';
import { useAddGuarantor, useAvailableGuarantors } from '../hooks';
import { addGuarantorSchema, type AddGuarantorFormValues } from '../schemas';

export function GuarantorPicker({
  loanRequestId,
  invited,
  onInvited,
}: {
  loanRequestId: string;
  invited: LoanGuarantor[];
  onInvited: (guarantor: LoanGuarantor) => void;
}) {
  const { data: candidates } = useAvailableGuarantors();
  const mutation = useAddGuarantor(loanRequestId);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddGuarantorFormValues>({ resolver: zodResolver(addGuarantorSchema) });

  const invitedIds = new Set(invited.map((g) => g.memberId));
  const remainingCandidates = candidates?.filter((c) => !invitedIds.has(c.memberId)) ?? [];

  return (
    <div className="space-y-4">
      {invited.length > 0 && (
        <ul className="space-y-2">
          {invited.map((guarantor) => (
            <li
              key={guarantor.id}
              className="flex items-center justify-between rounded-control border border-border-subtle bg-surface-raised px-3 py-2 text-sm"
            >
              <span className="text-text-primary">
                {candidates?.find((c) => c.memberId === guarantor.memberId)?.email ??
                  guarantor.memberId}
              </span>
              <StatusBadge status={guarantor.status} />
            </li>
          ))}
        </ul>
      )}

      {remainingCandidates.length > 0 ? (
        <form
          className="space-y-3"
          onSubmit={handleSubmit((values) =>
            mutation.mutate(values, {
              onSuccess: (guarantor) => {
                onInvited(guarantor);
                reset({ guarantorMemberId: '' });
              },
            }),
          )}
        >
          <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />

          <Controller
            control={control}
            name="guarantorMemberId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a guarantor" />
                </SelectTrigger>
                <SelectContent>
                  {remainingCandidates.map((candidate) => (
                    <SelectItem key={candidate.memberId} value={candidate.memberId}>
                      {candidate.email}, credibility score {candidate.credibilityScore}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.guarantorMemberId && (
            <p role="alert" className="text-xs text-danger">
              {errors.guarantorMemberId.message}
            </p>
          )}

          <Button type="submit" size="sm" isLoading={mutation.isPending}>
            {invited.length > 0 ? 'Invite another' : 'Send invite'}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-text-muted">No more eligible members to invite.</p>
      )}
    </div>
  );
}
