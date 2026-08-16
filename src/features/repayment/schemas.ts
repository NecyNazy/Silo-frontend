import { z } from 'zod';

export const repaymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
});

export type RepaymentFormValues = z.input<typeof repaymentSchema>;
export type RepaymentSubmitValues = z.output<typeof repaymentSchema>;
