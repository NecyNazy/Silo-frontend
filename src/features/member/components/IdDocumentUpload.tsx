import { useRef, useState } from 'react';
import { Button, FormAlert } from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import type { Member } from '@/shared/types/member';
import { useUploadIdDocument } from '../hooks';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function IdDocumentUpload({ member }: { member: Member }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const uploadMutation = useUploadIdDocument(member.id);

  function handleFileChange(file: File | null) {
    setValidationError(null);
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setValidationError('Only PNG, JPEG, or PDF files are accepted.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setValidationError('File must be smaller than 5MB.');
      return;
    }

    uploadMutation.mutate(file);
  }

  return (
    <div className="space-y-2">
      <FormAlert message={validationError} />
      <FormAlert message={uploadMutation.isError ? getErrorMessage(uploadMutation.error) : null} />

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={uploadMutation.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {member.idDocumentRef ? 'Replace ID document' : 'Upload ID document'}
        </Button>
        {member.idDocumentRef && !uploadMutation.isPending && (
          <span className="text-xs text-slate-500 dark:text-slate-400">Document on file</span>
        )}
      </div>
      {uploadMutation.isSuccess && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          Document uploaded — pending officer review.
        </p>
      )}
    </div>
  );
}
