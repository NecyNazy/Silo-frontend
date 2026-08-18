import { describe, expect, it } from 'vitest';
import { formatMoney } from '../money';

describe('formatMoney', () => {
  it('formats whole numbers as NGN currency', () => {
    expect(formatMoney(150000)).toBe('₦150,000.00');
  });

  it('formats zero', () => {
    expect(formatMoney(0)).toBe('₦0.00');
  });

  it('rounds to two decimal places', () => {
    expect(formatMoney(199.999)).toBe('₦200.00');
  });
});
