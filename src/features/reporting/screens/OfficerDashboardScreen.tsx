import { motion } from 'motion/react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, ErrorState, Money, PageHeader } from '@/shared/components';
import { CardSkeleton } from '@/shared/components/Skeleton';
import { fadeInUp, staggerChildren } from '@/shared/lib/motion';
import { useDashboardMetrics } from '../hooks';

const DONUT_COLORS = ['var(--color-accent)', 'var(--color-danger)'];

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

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerChildren(0.08)}
        className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Active loans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-text-primary">{metrics.activeLoans}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Total contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <Money amount={metrics.totalContributions} className="text-2xl font-semibold text-text-primary" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Outstanding balance</CardTitle>
            </CardHeader>
            <CardContent>
              <Money amount={metrics.outstandingBalance} className="text-2xl font-semibold text-text-primary" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Default rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-text-primary">
                {metrics.defaultRate.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
      </motion.div>
    </div>
  );
}
