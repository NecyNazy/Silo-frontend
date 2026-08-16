import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormAlert,
  Input,
  Label,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useRejectLoanRequest } from '../hooks';
import { rejectLoanRequestSchema, type RejectLoanRequestFormValues } from '../schemas';

export function RejectRequestDialog({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useRejectLoanRequest(requestId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RejectLoanRequestFormValues>({ resolver: zodResolver(rejectLoanRequestSchema) });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject loan request</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((values) =>
            mutation.mutate(values.reason, { onSuccess: () => setOpen(false) }),
          )}
        >
          <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Input id="reason" {...register('reason')} />
            {errors.reason && (
              <p role="alert" className="text-xs text-red-600">
                {errors.reason.message}
              </p>
            )}
          </div>
          <Button type="submit" variant="destructive" isLoading={mutation.isPending}>
            Confirm rejection
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
