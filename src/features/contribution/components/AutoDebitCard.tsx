import { CreditCard, Repeat } from 'lucide-react';
import { useState } from 'react';
import { useMyProfile } from '@/features/member/hooks';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormAlert,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
} from '@/shared/components';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatDate } from '@/shared/lib/date';
import { getErrorMessage } from '@/shared/lib/error';
import type { AutoDebitMandate, AutoDebitPeriodicity } from '@/shared/types/contribution';
import { useAutoDebitMandate, useMemberContributions, useSetupAutoDebit, useUpdateAutoDebit } from '../hooks';

const PERIODICITY_LABEL: Record<AutoDebitPeriodicity, string> = {
  WEEKLY: 'week',
  MONTHLY: 'month',
};

function AutoDebitSetupForm({ failedMandate }: { failedMandate: AutoDebitMandate | null }) {
  const setupMutation = useSetupAutoDebit();
  const [amount, setAmount] = useState(failedMandate ? String(failedMandate.amount) : '');
  const [periodicity, setPeriodicity] = useState<AutoDebitPeriodicity>(
    failedMandate?.periodicity ?? 'MONTHLY',
  );

  function handleSetup() {
    const amountNaira = Number(amount);
    if (!amountNaira || amountNaira <= 0) return;
    setupMutation.mutate({ amount: amountNaira, periodicity });
  }

  return (
    <>
      <p className="text-sm text-text-muted">
        Have a set amount pulled from your card automatically, weekly or monthly, instead of
        contributing by hand each time.
      </p>
      {failedMandate && (
        <p className="text-sm text-danger">
          The last {failedMandate.consecutiveFailureCount} attempt
          {failedMandate.consecutiveFailureCount === 1 ? '' : 's'} failed
          {failedMandate.lastFailureReason ? `: ${failedMandate.lastFailureReason}.` : '.'}
        </p>
      )}
      <FormAlert message={setupMutation.isError ? getErrorMessage(setupMutation.error) : null} />
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="auto-debit-amount">Amount (NGN)</Label>
          <Input
            id="auto-debit-amount"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="auto-debit-period">Every</Label>
          <Select
            value={periodicity}
            onValueChange={(value) => setPeriodicity(value as AutoDebitPeriodicity)}
          >
            <SelectTrigger id="auto-debit-period" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEKLY">Week</SelectItem>
              <SelectItem value="MONTHLY">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSetup} isLoading={setupMutation.isPending}>
          {failedMandate ? 'Re-set up auto-debit' : 'Set up auto-debit'}
        </Button>
      </div>
    </>
  );
}

export function AutoDebitCard() {
  const { data: member } = useMyProfile();
  const { data: mandate, isLoading } = useAutoDebitMandate();
  const { data: contributions, isLoading: contributionsLoading } = useMemberContributions(
    member?.id,
  );
  const updateMutation = useUpdateAutoDebit();

  const needsSetup = !mandate || mandate.status === 'CANCELLED' || mandate.status === 'FAILED';
  const hasPaystackContribution = contributions?.some((c) => c.source === 'PAYSTACK') ?? false;
  const loading = isLoading || contributionsLoading;

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <Repeat className="h-4 w-4 text-accent" aria-hidden="true" />
        <CardTitle>Recurring contribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <Skeleton className="h-8 w-40" />
        ) : !hasPaystackContribution ? (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning-muted text-warning">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">No card on file yet</p>
              <p className="mt-0.5 text-sm text-text-muted">
                Make one card contribution above first. Auto-debit reuses that card going forward.
              </p>
            </div>
          </div>
        ) : needsSetup ? (
          <AutoDebitSetupForm failedMandate={mandate?.status === 'FAILED' ? mandate : null} />
        ) : (
          mandate && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={mandate.status} />
                <span className="text-sm text-text-secondary">
                  ₦{mandate.amount.toLocaleString()} every {PERIODICITY_LABEL[mandate.periodicity]}
                </span>
              </div>
              <p className="text-sm text-text-muted">
                Next charge {formatDate(mandate.nextChargeDate)}.
              </p>
              <FormAlert
                message={updateMutation.isError ? getErrorMessage(updateMutation.error) : null}
              />
              <div className="flex gap-2">
                {mandate.status === 'ACTIVE' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ action: 'PAUSE' })}
                  >
                    Pause
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    isLoading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ action: 'RESUME' })}
                  >
                    Resume
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  isLoading={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ action: 'CANCEL' })}
                >
                  Cancel
                </Button>
              </div>
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
