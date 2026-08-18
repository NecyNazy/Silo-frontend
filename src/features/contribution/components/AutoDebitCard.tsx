import { CreditCard, Repeat } from 'lucide-react';
import { useState } from 'react';
import { useMyProfile } from '@/features/member/hooks';
import { usePaystackCheckout } from '@/features/paymentgateway/usePaystackCheckout';
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
import type { AutoDebitPeriodicity } from '@/shared/types/contribution';
import { useAutoDebitMandate, useSetupAutoDebit, useUpdateAutoDebit } from '../hooks';

const PERIODICITY_LABEL: Record<AutoDebitPeriodicity, string> = {
  WEEKLY: 'week',
  MONTHLY: 'month',
};

export function AutoDebitCard() {
  const { data: member } = useMyProfile();
  const { data: mandate, isLoading } = useAutoDebitMandate();
  const { open, status: checkoutStatus, isConfigured } = usePaystackCheckout();
  const setupMutation = useSetupAutoDebit();
  const updateMutation = useUpdateAutoDebit();
  const [amount, setAmount] = useState('');
  const [periodicity, setPeriodicity] = useState<AutoDebitPeriodicity>('MONTHLY');

  function handleSetup() {
    const amountNaira = Number(amount);
    if (!amountNaira || amountNaira <= 0 || !member) return;

    open({ email: member.email, amountNaira }, (reference) => {
      setupMutation.mutate({ amount: amountNaira, periodicity, reference });
    });
  }

  const needsSetup = !mandate || mandate.status === 'CANCELLED';

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <Repeat className="h-4 w-4 text-accent" aria-hidden="true" />
        <CardTitle>Recurring contribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-8 w-40" />
        ) : !isConfigured ? (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warning-muted text-warning">
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Card payment not set up</p>
              <p className="mt-0.5 text-sm text-text-muted">
                Auto-debit needs a card on file. Ask an officer to record contributions manually
                until card payments are enabled.
              </p>
            </div>
          </div>
        ) : needsSetup ? (
          <>
            <p className="text-sm text-text-muted">
              Have a set amount pulled from your card automatically, weekly or monthly, instead
              of contributing by hand each time.
            </p>
            <FormAlert
              message={setupMutation.isError ? getErrorMessage(setupMutation.error) : null}
            />
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
              <Button
                onClick={handleSetup}
                isLoading={checkoutStatus === 'loading' || setupMutation.isPending}
              >
                Set up auto-debit
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={mandate.status} />
              <span className="text-sm text-text-secondary">
                ₦{mandate.amount.toLocaleString()} every {PERIODICITY_LABEL[mandate.periodicity]}
              </span>
            </div>

            {mandate.status === 'FAILED' ? (
              <>
                <p className="text-sm text-danger">
                  The last {mandate.consecutiveFailureCount} attempt
                  {mandate.consecutiveFailureCount === 1 ? '' : 's'} failed
                  {mandate.lastFailureReason ? `: ${mandate.lastFailureReason}.` : '.'} Set it up
                  again to keep contributing automatically.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={checkoutStatus === 'loading' || setupMutation.isPending}
                  onClick={handleSetup}
                >
                  Re-set up auto-debit
                </Button>
              </>
            ) : (
              <>
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
                      onClick={() => updateMutation.mutate({ status: 'PAUSED' })}
                    >
                      Pause
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ status: 'ACTIVE' })}
                    >
                      Resume
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    isLoading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ status: 'CANCELLED' })}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
