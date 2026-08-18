import { describe, expect, it } from 'vitest';
import { createLoanRequestSchema } from '../schemas';

describe('createLoanRequestSchema', () => {
  it('accepts a valid loan request', () => {
    const result = createLoanRequestSchema.safeParse({
      amountRequested: '150000',
      purpose: 'Shop inventory restock',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ amountRequested: 150000, purpose: 'Shop inventory restock' });
    }
  });

  it('rejects a non-positive amount', () => {
    const result = createLoanRequestSchema.safeParse({
      amountRequested: '0',
      purpose: 'Shop inventory restock',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a purpose that is too short', () => {
    const result = createLoanRequestSchema.safeParse({
      amountRequested: '150000',
      purpose: 'hi',
    });

    expect(result.success).toBe(false);
  });
});
