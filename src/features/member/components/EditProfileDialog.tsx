import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { ID_TYPES, type Member } from '@/shared/types/member';
import { useUpdateMemberProfile } from '../hooks';
import { updateMemberProfileSchema, type UpdateMemberProfileFormValues } from '../schemas';

export function EditProfileDialog({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateMemberProfile(member.id);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateMemberProfileFormValues>({
    resolver: zodResolver(updateMemberProfileSchema),
    defaultValues: {
      fullName: member.fullName,
      phoneNumber: member.phoneNumber,
      idType: ID_TYPES.includes(member.idType as (typeof ID_TYPES)[number])
        ? (member.idType as (typeof ID_TYPES)[number])
        : undefined,
      idNumber: member.idNumber ?? '',
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your contact and ID details.</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) =>
            updateMutation.mutate(
              { ...values, idDocumentRef: member.idDocumentRef ?? undefined },
              { onSuccess: () => setOpen(false) },
            ),
          )}
        >
          <FormAlert message={updateMutation.isError ? getErrorMessage(updateMutation.error) : null} />

          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" className="max-w-sm" {...register('fullName')} />
            {errors.fullName && (
              <p role="alert" className="text-xs text-danger">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" className="max-w-sm" value={member.email} disabled />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phoneNumber">Phone</Label>
            <Input id="phoneNumber" className="max-w-sm" {...register('phoneNumber')} />
            {errors.phoneNumber && (
              <p role="alert" className="text-xs text-danger">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="idType">ID type</Label>
              <Controller
                control={control}
                name="idType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="idType">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ID_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="idNumber">ID number</Label>
              <Input id="idNumber" {...register('idNumber')} />
            </div>
          </div>

          <Button type="submit" isLoading={updateMutation.isPending} disabled={!isDirty}>
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
