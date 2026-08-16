import {
  BarChart3,
  Bell,
  BookOpen,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Users,
  Wallet,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { cn } from '@/shared/lib/cn';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/loan-requests', label: 'Loan Requests', icon: Wallet },
  { to: '/admin/loans', label: 'Loans', icon: BookOpen },
  { to: '/admin/contributions', label: 'Contributions', icon: PiggyBank },
  { to: '/admin/ledger', label: 'Ledger', icon: BarChart3 },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export function OfficerLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-svh bg-slate-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="px-5 py-5">
          <span className="text-lg font-semibold text-indigo-800">Silo</span>
          <p className="text-xs text-slate-400">Officer console</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100',
                  isActive && 'bg-indigo-50 text-indigo-800',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mx-3 mb-4 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
