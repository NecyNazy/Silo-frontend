import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { usePaystackCheckout } from '@/features/paymentgateway/usePaystackCheckout';
import { Button, Input, Label } from '@/shared/components';
import { getMemberContributions } from '../api';

type Phase = 'idle' | 'confirming' | 'confirmed' | 'timeout';

const POLL_INTERVAL_MS = 4000;
const TIMEOUT_MS = 60_000;

export function ContributionCta({ email }: { email: string }) {
  const memberId = useAuthStore((s) => s.memberId);
  const queryClient = useQueryClient();
  const { open, status, isConfigured } = usePaystackCheckout();
  const [amount, setAmount] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const referenceRef = useRef<string | null>(null);

  useEffect(() => {
    if (phase !== 'confirming' || !memberId) return;

    const start = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - start > TIMEOUT_MS) {
        setPhase('timeout');
        clearInterval(interval);
        return;
      }

      getMemberContributions(memberId).then((page) => {
        const matched = page.content.some(
          (c) => c.reference === referenceRef.current && c.status === 'CONFIRMED',
        );
        if (matched) {
          setPhase('confirmed');
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: ['contributions', memberId] });
        }
      });
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [phase, memberId, queryClient]);

  function handleContribute() {
    const amountNaira = Number(amount);
    if (!amountNaira || amountNaira <= 0) return;

    open({ email, amountNaira }, (reference) => {
      referenceRef.current = reference;
      setPhase('confirming');
    });
  }

  if (!isConfigured) {
    return (
      <p className="text-sm text-slate-500">
        Paystack isn't configured in this environment — contributions can still be recorded
        manually by an officer.
      </p>
    );
  }

  if (phase === 'confirming') {
    return <p className="text-sm font-medium text-amber-700">Confirming your contribution…</p>;
  }

  if (phase === 'confirmed') {
    return <p className="text-sm font-medium text-emerald-700">Contribution confirmed.</p>;
  }

  if (phase === 'timeout') {
    return (
      <p className="text-sm text-slate-600">
        We'll notify you once this is confirmed — check your notifications shortly.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="contribution-amount">Amount (NGN)</Label>
        <Input
          id="contribution-amount"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-40"
        />
      </div>
      <Button onClick={handleContribute} isLoading={status === 'loading'}>
        Contribute via Paystack
      </Button>
    </div>
  );
}
