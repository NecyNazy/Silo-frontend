import { http, HttpResponse } from 'msw';
import { contributions, loans } from '../db';

export const reportingHandlers = [
  http.get('/api/reports/dashboard', () => {
    const activeLoans = loans.filter((l) => l.status === 'ACTIVE').length;
    const defaultedLoans = loans.filter((l) => l.status === 'DEFAULTED').length;
    const totalContributions = contributions
      .filter((c) => c.status === 'CONFIRMED')
      .reduce((sum, c) => sum + c.amount, 0);
    const outstandingBalance = loans.reduce((sum, l) => sum + l.outstandingBalance, 0);
    const defaultRatePercent = loans.length > 0 ? (defaultedLoans / loans.length) * 100 : 0;

    return HttpResponse.json({
      activeLoans,
      totalContributions,
      outstandingBalance,
      defaultRatePercent,
      generatedAt: new Date().toISOString(),
    });
  }),
];
