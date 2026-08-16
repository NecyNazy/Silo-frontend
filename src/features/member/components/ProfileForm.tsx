import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, FormAlert, Input, Label } from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import type { Member } from '@/shared/types/member';
import { useUpdateMember } from '../hooks';
import { updateMemberSchema, type UpdateMemberFormValues } from '../schemas';

export function ProfileForm({ member }: { member: Member }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateMemberFormValues>({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: { fullName: member.fullName, phone: member.phone },
  });
  const updateMutation = useUpdateMember(member.id);

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
    >
      <FormAlert message={updateMutation.isError ? getErrorMessage(updateMutation.error) : null} />

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" {...register('fullName')} />
        {errors.fullName && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={member.email} disabled />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" {...register('phone')} />
        {errors.phone && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.phone.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={updateMutation.isPending} disabled={!isDirty}>
        Save changes
      </Button>
      {updateMutation.isSuccess && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">Profile updated.</p>
      )}
    </form>
  );
}
