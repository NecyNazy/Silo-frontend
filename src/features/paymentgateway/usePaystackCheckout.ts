import { useCallback, useState } from 'react';
import { loadPaystackScript } from './paystack';

export type CheckoutStatus = 'idle' | 'loading' | 'unavailable';

export interface CheckoutInput {
  email: string;
  amountNaira: number;
}

export function usePaystackCheckout() {
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const open = useCallback(
    (input: CheckoutInput, onSuccess: (reference: string) => void) => {
      if (!publicKey) {
        setStatus('unavailable');
        return;
      }

      setStatus('loading');
      loadPaystackScript()
        .then(() => {
          setStatus('idle');
          window.PaystackPop!.setup({
            key: publicKey,
            email: input.email,
            amount: Math.round(input.amountNaira * 100),
            currency: 'NGN',
            ref: `silo-${Date.now()}`,
            onSuccess: (transaction) => onSuccess(transaction.reference),
            onCancel: () => setStatus('idle'),
          }).openIframe();
        })
        .catch(() => setStatus('unavailable'));
    },
    [publicKey],
  );

  return { open, status, isConfigured: Boolean(publicKey) };
}
