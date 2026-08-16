import { formatMoney } from '../lib/money';
import { cn } from '../lib/cn';

export interface MoneyProps {
  amount: number;
  className?: string;
}

export function Money({ amount, className }: MoneyProps) {
  return (
    <span className={cn('tabular-nums text-right', className)}>
      {formatMoney(amount)}
    </span>
  );
}
