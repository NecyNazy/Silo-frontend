import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, ErrorState, Money, PageHeader } from '@/shared/components';
import { CardSkeleton } from '@/shared/components/Skeleton';
import { useDashboardMetrics } from '../hooks';

const DONUT_COLORS = ['#4338ca', '#e11d48'];

export function OfficerDashboardScreen() {
  const { data: metrics, isLoading, isError, refetch } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !metrics) return <ErrorState onRetry={() => refetch()} />;

  const donutData = [
    { name: 'On track', value: 100 - metrics.defaultRate },
    { name: 'Defaulted', value: metrics.defaultRate },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Live org metrics, refreshed every 15 seconds." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active loans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{metrics.activeLoans}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <Money amount={metrics.totalContributions} className="text-2xl font-semibold text-slate-900 dark:text-slate-100" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Outstanding balance</CardTitle>
          </CardHeader>
          <CardContent>
            <Money amount={metrics.outstandingBalance} className="text-2xl font-semibold text-slate-900 dark:text-slate-100" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Default rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {metrics.defaultRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                  {donutData.map((entry, index) => (
                    <Cell key={entry.name} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
