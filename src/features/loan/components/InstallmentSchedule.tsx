import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  StatusBadge,
  Money,
} from '@/shared/components';
import { formatDate } from '@/shared/lib/date';
import type { LoanInstallment } from '@/shared/types/loan';

export function InstallmentSchedule({ installments }: { installments: LoanInstallment[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>#</TableHeaderCell>
          <TableHeaderCell>Due date</TableHeaderCell>
          <TableHeaderCell>Amount due</TableHeaderCell>
          <TableHeaderCell>Amount paid</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {installments.map((installment) => (
          <TableRow key={installment.id}>
            <TableCell>{installment.installmentNumber}</TableCell>
            <TableCell>{formatDate(installment.dueDate)}</TableCell>
            <TableCell>
              <Money amount={installment.amountDue} />
            </TableCell>
            <TableCell>
              <Money amount={installment.amountPaid} />
            </TableCell>
            <TableCell>
              <StatusBadge status={installment.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
