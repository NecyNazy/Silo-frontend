import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  FormAlert,
} from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import { useRejectLoanRequest } from '../hooks';

export function RejectRequestDialog({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const mutation = useRejectLoanRequest(requestId);

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
          <DialogDescription>
            This cannot be undone. The member will need to submit a new request.
          </DialogDescription>
        </DialogHeader>
        <FormAlert message={mutation.isError ? getErrorMessage(mutation.error) : null} />
        <Button
          variant="destructive"
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate(undefined, { onSuccess: () => setOpen(false) })}
        >
          Confirm rejection
        </Button>
      </DialogContent>
    </Dialog>
  );
}
