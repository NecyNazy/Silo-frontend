import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  PiggyBank,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  NotificationBell,
  ThemeToggle,
} from '@/shared/components';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/loans', label: 'My loans', icon: ShieldCheck },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/loans', label: 'Loans', icon: Wallet },
  { to: '/admin/contributions', label: 'Contributions', icon: PiggyBank },
  { to: '/admin/officer-applications', label: 'Officer applications', icon: UserCog },
  { to: '/admin/ledger', label: 'Ledger', icon: BarChart3 },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export function OfficerLayout({ children }: { children?: ReactNode }) {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-svh flex-col bg-canvas md:flex-row">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-subtle bg-surface/80 px-4 py-3 backdrop-blur-lg md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open officer navigation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-control text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
            >
              <Menu className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {NAV_ITEMS.map((item) => (
              <DropdownMenuItem key={item.to} asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn('flex items-center gap-2.5', isActive && 'text-accent')
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout} className="flex items-center gap-2.5">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-lg font-semibold tracking-tight text-text-primary">
          Silo<span className="text-accent">.</span>
        </span>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </header>

      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col overflow-y-auto border-r border-border-subtle bg-surface/60 backdrop-blur-lg md:flex">
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              Silo<span className="text-accent">.</span>
            </span>
            <p className="text-xs text-text-muted">Officer console</p>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
        <nav className="relative flex flex-1 flex-col gap-0.5 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-2.5 rounded-control px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary',
                  isActive && 'text-accent',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="officer-nav-active"
                      className="absolute inset-0 rounded-control bg-accent-muted"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <item.icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="mx-3 mb-4 flex items-center gap-2.5 rounded-control px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </motion.button>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
}
