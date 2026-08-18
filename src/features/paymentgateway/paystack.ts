export interface PaystackTransaction {
  reference: string;
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  onSuccess: (transaction: PaystackTransaction) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

const SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';
let scriptPromise: Promise<void> | null = null;

export function loadPaystackScript(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Paystack checkout'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}
