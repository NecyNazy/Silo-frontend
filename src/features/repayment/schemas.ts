import { z } from 'zod';

export function createRepaymentSchema(maxAmount: number) {
  return z.object({
    amount: z.coerce
      .number()
      .positive('Amount must be greater than zero')
      .max(maxAmount, `Amount cannot exceed the outstanding balance of ${maxAmount}`),
    reference: z.string().min(1, 'Reference is required'),
  });
}

export type RepaymentFormValues = z.input<ReturnType<typeof createRepaymentSchema>>;
export type RepaymentSubmitValues = z.output<ReturnType<typeof createRepaymentSchema>>;
