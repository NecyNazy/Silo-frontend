import { useForm } from 'react-hook-form';

import { useUpdateMemberProfile } from '../hooks';
import type { Member } from '@/shared/types/member';
import { getErrorMessage } from '@/shared/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormAlert, Input, Label } from '@/shared/components';
import { updateMemberProfileSchema, type UpdateMemberProfileFormValues } from '../schemas';

export function ProfileForm({ member }: { member: Member }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateMemberProfileFormValues>({
    resolver: zodResolver(updateMemberProfileSchema),
    defaultValues: {
      fullName: member.fullName,
      phoneNumber: member.phoneNumber,
      idType: member.idType ?? '',
      idNumber: member.idNumber ?? '',
      idDocumentRef: member.idDocumentRef ?? '',
    },
  });
  const updateMutation = useUpdateMemberProfile(member.id);

  return (
    <form className="space-y-4" onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
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
        <Label htmlFor="phoneNumber">Phone</Label>
        <Input id="phoneNumber" {...register('phoneNumber')} />
        {errors.phoneNumber && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="idType">ID type</Label>
          <Input id="idType" placeholder="e.g. National ID, Passport" {...register('idType')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="idNumber">ID number</Label>
          <Input id="idNumber" {...register('idNumber')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="idDocumentRef">ID document reference</Label>
        <Input
          id="idDocumentRef"
          placeholder="Link or reference to your ID document"
          {...register('idDocumentRef')}
        />
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
