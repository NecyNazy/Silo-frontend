import { Home, LogOut, User, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { NotificationBell, ThemeToggle } from '@/shared/components';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/loans', label: 'Loans', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
];

export function MemberLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-subtle bg-surface/80 px-4 py-3 backdrop-blur-lg sm:px-6">
        <span className="text-lg font-semibold tracking-tight text-text-primary">
          Silo<span className="text-accent">.</span>
        </span>
        <nav className="relative hidden items-center gap-1 sm:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-control px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary',
                  isActive && 'text-accent',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="member-nav-active"
                      className="absolute inset-0 rounded-control bg-accent-muted"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={logout}
            className="flex items-center gap-1.5 rounded-control px-2 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </motion.button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pb-6">
        <div className="mx-auto w-full max-w-4xl">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border-subtle bg-surface/90 py-2 backdrop-blur-lg sm:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium text-text-muted transition-colors',
                isActive && 'text-accent',
              )
            }
          >
            {() => (
              <motion.span whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-0.5">
                <item.icon className="h-5 w-5" />
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
