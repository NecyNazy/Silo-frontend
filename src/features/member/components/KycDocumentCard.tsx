import { FileText, Sparkles, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, FormAlert } from '@/shared/components';
import { getErrorMessage } from '@/shared/lib/error';
import type { Member } from '@/shared/types/member';
import { useUpdateMemberProfile, useUploadKycDocument } from '../hooks';

function isPdf(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf');
}

export function KycDocumentCard({ member }: { member: Member }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadKycDocument(member.id);
  const updateProfileMutation = useUpdateMemberProfile(member.id);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const documentRef = member.idDocumentRef;
  const extracted = uploadMutation.data?.extracted;
  const showSuggestion =
    !suggestionDismissed && extracted && (extracted.idType || extracted.idNumber);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSuggestionDismissed(false);
      uploadMutation.mutate(file);
    }
    event.target.value = '';
  }

  function acceptSuggestion() {
    if (!extracted) return;
    updateProfileMutation.mutate(
      {
        fullName: member.fullName,
        phoneNumber: member.phoneNumber,
        idType: extracted.idType ?? member.idType ?? undefined,
        idNumber: extracted.idNumber ?? member.idNumber ?? undefined,
        idDocumentRef: member.idDocumentRef ?? undefined,
      },
      { onSuccess: () => setSuggestionDismissed(true) },
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>KYC document</CardTitle>
        <Button
          variant="outline"
          size="sm"
          isLoading={uploadMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          {documentRef ? 'Replace document' : 'Upload document'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <FormAlert message={uploadMutation.isError ? getErrorMessage(uploadMutation.error) : null} />
        {uploadMutation.isSuccess && !showSuggestion && (
          <p className="text-sm text-success">Document uploaded.</p>
        )}

        {showSuggestion && (
          <div className="flex items-start gap-3 rounded-control border border-accent/25 bg-accent-muted px-3 py-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-text-primary">
                We read this from your document
                {extracted?.idType && <>: <span className="font-medium">{extracted.idType}</span></>}
                {extracted?.idNumber && (
                  <>
                    {extracted.idType ? ', ' : ': '}
                    <span className="font-medium">{extracted.idNumber}</span>
                  </>
                )}
                . Use these details?
              </p>
              <FormAlert
                message={
                  updateProfileMutation.isError ? getErrorMessage(updateProfileMutation.error) : null
                }
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  isLoading={updateProfileMutation.isPending}
                  onClick={acceptSuggestion}
                >
                  Use these details
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={updateProfileMutation.isPending}
                  onClick={() => setSuggestionDismissed(true)}
                >
                  Ignore
                </Button>
              </div>
            </div>
          </div>
        )}

        {documentRef ? (
          isPdf(documentRef) ? (
            <a
              href={documentRef}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-control border border-border-subtle bg-surface-raised px-3 py-2 text-sm font-medium text-accent hover:underline"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              View uploaded document (PDF)
            </a>
          ) : (
            <a href={documentRef} target="_blank" rel="noreferrer" className="block w-fit">
              <img
                src={documentRef}
                alt="Uploaded ID document"
                className="max-h-48 rounded-control border border-border-subtle object-cover"
              />
            </a>
          )
        ) : (
          <p className="text-sm text-text-muted">
            No document uploaded yet. Upload a clear photo or PDF of your ID so an officer can
            verify your KYC.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
