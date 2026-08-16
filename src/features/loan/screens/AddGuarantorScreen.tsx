import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  FormAlert,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useAddGuarantor, useAvailableGuarantors } from '../hooks';
import { addGuarantorSchema, type AddGuarantorFormValues } from '../schemas';

export function AddGuarantorScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: candidates } = useAvailableGuarantors();
  const mutation = useAddGuarantor(id as string);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddGuarantorFormValues>({ resolver: zodResolver(addGuarantorSchema) });

  return (
    <div>
      <PageHeader
        title="Add a guarantor"
        description="Candidates are shown with their credit score so you can judge fit."
      />

      <form
        className="max-w-md space-y-4"
        onSubmit={handleSubmit((values) =>
          mutation.mutate(values, { onSuccess: () => navigate(`/loans/${id}`) }),
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
                {candidates?.map((candidate) => (
                  <SelectItem key={candidate.memberId} value={candidate.memberId}>
                    {candidate.email} — credibility score {candidate.credibilityScore}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.guarantorMemberId && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.guarantorMemberId.message}
          </p>
        )}

        <Button type="submit" isLoading={mutation.isPending}>
          Send invite
        </Button>
      </form>
    </div>
  );
}
