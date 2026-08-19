import {
  ArrowRight,
  BarChart3,
  Handshake,
  PiggyBank,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button, ThemeToggle } from '@/shared/components';
import { fadeInUp, staggerChildren } from '@/shared/lib/motion';

const FEATURES = [
  {
    icon: PiggyBank,
    title: 'Contribute to the shared fund',
    description:
      'Add money manually or through Paystack, and watch your running total and history in one place.',
  },
  {
    icon: Handshake,
    title: 'Loans backed by a guarantor',
    description:
      'Request a loan, invite someone to vouch for you, and see exactly how their credibility and risk tier factor into approval.',
  },
  {
    icon: BarChart3,
    title: 'A real double-entry ledger',
    description:
      'Every contribution, disbursement, and repayment posts to a proper ledger underneath, not a spreadsheet pretending to be one.',
  },
  {
    icon: ShieldCheck,
    title: 'KYC-gated trust',
    description:
      'Members are verified before they can contribute or borrow, so the cooperative fund stays accountable to everyone in it.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Join the cooperative',
    description: 'An officer creates your member profile, then you set your own password.',
  },
  {
    step: '02',
    title: 'Get verified',
    description: 'Upload an ID document. Once an officer confirms your KYC, you can transact.',
  },
  {
    step: '03',
    title: 'Contribute or borrow',
    description: 'Save into the fund on your schedule, or request a guarantor-backed loan.',
  },
];

export function LandingScreen() {
  return (
    <div className="relative min-h-svh overflow-x-hidden bg-canvas">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 0%, var(--color-accent-muted), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <header className="sticky top-0 z-30 border-b border-border-subtle bg-canvas/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-text-primary">
            Silo<span className="text-accent">.</span>
          </span>
          <nav className="hidden items-center gap-6 text-sm font-medium text-text-secondary md:flex">
            <a href="#features" className="transition-colors hover:text-text-primary">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-text-primary">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerChildren(0.12)}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent"
            >
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Built for member-owned cooperatives
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="mt-6 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl md:text-6xl"
            >
              Save together. Borrow on trust.
              <br />
              <span className="text-accent">Track every naira.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
              Silo is where your cooperative contributes, requests guarantor-backed loans, and
              repays, all reconciled against a real ledger, not a group chat and a shared sheet.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <Link to="/register">
                  Create your account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Sign in</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.3 }}
            style={{ perspective: 1200 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="rounded-card border border-border-subtle bg-surface/80 p-2 shadow-raised backdrop-blur-xl">
              <div className="grid gap-2 rounded-[calc(var(--radius-card)-0.35rem)] bg-surface-raised p-6 sm:grid-cols-3">
                {[
                  { label: 'Active loans', value: '128', icon: Wallet },
                  { label: 'Total contributions', value: '₦42.6M', icon: PiggyBank },
                  { label: 'Default rate', value: '1.2%', icon: ShieldCheck },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 260, damping: 26 }}
                    className="rounded-control border border-border-subtle bg-surface p-4"
                  >
                    <stat.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    <p className="mt-3 text-2xl font-semibold tabular-nums text-text-primary">
                      {stat.value}
                    </p>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-text-muted">
              Illustrative preview of the live cooperative dashboard.
            </p>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
              Everything a thrift needs, none of the spreadsheets
            </h2>
            <p className="mt-3 text-text-secondary">
              One platform for contributions, loans, guarantors, and the accounting behind them.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerChildren(0.1)}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="rounded-card border border-border-subtle bg-surface p-6 shadow-card transition-shadow hover:border-border-strong hover:shadow-raised"
              >
                <motion.div
                  whileHover={{ rotate: -6, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-control bg-accent-muted text-accent"
                >
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </motion.div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary">How it works</h2>
            <p className="mt-3 text-text-secondary">
              Three steps between "not a member yet" and "borrowing against the fund."
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerChildren(0.15)}
            className="relative mt-14 grid gap-8 sm:grid-cols-3"
          >
            {STEPS.map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="relative text-center sm:text-left">
                <span className="text-4xl font-semibold text-accent-muted">{item.step}</span>
                <h3 className="mt-2 text-base font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-1.5 text-sm text-text-secondary">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 rounded-card border border-border-subtle bg-surface p-10 text-center shadow-raised sm:p-16"
          >
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
              Ready to bring your cooperative onto Silo?
            </h2>
            <p className="max-w-md text-text-secondary">
              Create your member profile and set a password in under two minutes.
            </p>
            <Button asChild size="lg">
              <Link to="/register">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border-subtle">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-text-muted sm:flex-row sm:px-6">
          <span className="font-semibold text-text-primary">
            Silo<span className="text-accent">.</span>
          </span>
          <p>Cooperative savings and loans, reconciled properly.</p>
        </div>
      </footer>
    </div>
  );
}
