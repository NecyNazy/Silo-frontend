import { describe, expect, it } from 'vitest';
import { createLoanRequestSchema } from '../schemas';

describe('createLoanRequestSchema', () => {
  it('accepts a valid loan request', () => {
    const result = createLoanRequestSchema.safeParse({
      amount: '150000',
      purpose: 'Shop inventory restock',
      termMonths: '6',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ amount: 150000, purpose: 'Shop inventory restock', termMonths: 6 });
    }
  });

  it('rejects a non-positive amount', () => {
    const result = createLoanRequestSchema.safeParse({
      amount: '0',
      purpose: 'Shop inventory restock',
      termMonths: '6',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a purpose that is too short', () => {
    const result = createLoanRequestSchema.safeParse({
      amount: '150000',
      purpose: 'hi',
      termMonths: '6',
    });

    expect(result.success).toBe(false);
  });
});
