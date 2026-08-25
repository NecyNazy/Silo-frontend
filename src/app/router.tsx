import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { useAuthStore } from '@/features/auth/store';
import { MemberLayout } from './layouts/MemberLayout';
import { OfficerLayout } from './layouts/OfficerLayout';
import { ComingSoonScreen } from './screens/ComingSoonScreen';
import { ForbiddenScreen } from './screens/ForbiddenScreen';
import { LandingScreen } from './screens/LandingScreen';
import { NotFoundScreen } from './screens/NotFoundScreen';

function lazyScreen<T extends Record<string, React.ComponentType>>(
  loader: () => Promise<T>,
  name: keyof T,
) {
  return lazy(() => loader().then((module) => ({ default: module[name] })));
}

const LoginScreen = lazyScreen(() => import('@/features/auth/screens/LoginScreen'), 'LoginScreen');
const RegisterScreen = lazyScreen(
  () => import('@/features/auth/screens/RegisterScreen'),
  'RegisterScreen',
);

const MemberDashboardScreen = lazyScreen(
  () => import('@/features/reporting/screens/MemberDashboardScreen'),
  'MemberDashboardScreen',
);
const ProfileScreen = lazyScreen(
  () => import('@/features/member/screens/ProfileScreen'),
  'ProfileScreen',
);
const MyLoansScreen = lazyScreen(
  () => import('@/features/loan/screens/MyLoansScreen'),
  'MyLoansScreen',
);
const LoanDetailScreen = lazyScreen(
  () => import('@/features/loan/screens/LoanDetailScreen'),
  'LoanDetailScreen',
);
const AddGuarantorScreen = lazyScreen(
  () => import('@/features/loan/screens/AddGuarantorScreen'),
  'AddGuarantorScreen',
);
const RepayScreen = lazyScreen(
  () => import('@/features/repayment/screens/RepayScreen'),
  'RepayScreen',
);
const OfficerDashboardScreen = lazyScreen(
  () => import('@/features/reporting/screens/OfficerDashboardScreen'),
  'OfficerDashboardScreen',
);
const AdminMembersScreen = lazyScreen(
  () => import('@/features/member/screens/AdminMembersScreen'),
  'AdminMembersScreen',
);
const AdminMemberDetailScreen = lazyScreen(
  () => import('@/features/member/screens/AdminMemberDetailScreen'),
  'AdminMemberDetailScreen',
);
const AdminLoanRequestDetailScreen = lazyScreen(
  () => import('@/features/loan/screens/AdminLoanRequestDetailScreen'),
  'AdminLoanRequestDetailScreen',
);
const AdminLoansScreen = lazyScreen(
  () => import('@/features/loan/screens/AdminLoansScreen'),
  'AdminLoansScreen',
);
const AdminLoanDetailScreen = lazyScreen(
  () => import('@/features/loan/screens/AdminLoanDetailScreen'),
  'AdminLoanDetailScreen',
);
const AdminContributionsScreen = lazyScreen(
  () => import('@/features/contribution/screens/AdminContributionsScreen'),
  'AdminContributionsScreen',
);
const AdminOfficerApplicationsScreen = lazyScreen(
  () => import('@/features/officerApplication/screens/AdminOfficerApplicationsScreen'),
  'AdminOfficerApplicationsScreen',
);

function RouteFallback() {
  return <div className="p-8 text-sm text-text-muted">Loading…</div>;
}

function HomeRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return <LandingScreen />;
  return <Navigate to="/dashboard" replace />;
}

/** Wraps a shared, role-agnostic screen in whichever chrome matches the caller's role. */
function RoleLayout({ children }: { children: ReactNode }) {
  const role = useAuthStore((s) => s.role);
  return role === 'OFFICER' ? (
    <OfficerLayout>{children}</OfficerLayout>
  ) : (
    <MemberLayout>{children}</MemberLayout>
  );
}

function DashboardRoute() {
  const role = useAuthStore((s) => s.role);
  return (
    <RoleLayout>{role === 'OFFICER' ? <OfficerDashboardScreen /> : <MemberDashboardScreen />}</RoleLayout>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardRoute />
            </AuthGuard>
          }
        />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/loans"
          element={
            <AuthGuard>
              <RoleLayout>
                <MyLoansScreen />
              </RoleLayout>
            </AuthGuard>
          }
        />

        <Route
          element={
            <AuthGuard>
              <MemberLayout />
            </AuthGuard>
          }
        >
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/contributions" element={<Navigate to="/dashboard" replace />} />
          <Route path="/loans/apply" element={<Navigate to="/loans" replace />} />
          <Route path="/loans/:id" element={<LoanDetailScreen />} />
          <Route path="/loans/:id/guarantors/add" element={<AddGuarantorScreen />} />
          <Route path="/loans/:id/repay" element={<RepayScreen />} />
          <Route path="/guarantor-invites" element={<Navigate to="/loans" replace />} />
          <Route
            path="/guarantor-liabilities"
            element={<ComingSoonScreen title="Guarantor liabilities" />}
          />
        </Route>

        <Route
          element={
            <RoleGuard role="OFFICER">
              <OfficerLayout />
            </RoleGuard>
          }
        >
          <Route path="/admin/members" element={<AdminMembersScreen />} />
          <Route path="/admin/members/:id" element={<AdminMemberDetailScreen />} />
          <Route path="/admin/loan-requests" element={<Navigate to="/admin/loans" replace />} />
          <Route path="/admin/loan-requests/:id" element={<AdminLoanRequestDetailScreen />} />
          <Route path="/admin/loans" element={<AdminLoansScreen />} />
          <Route path="/admin/loans/:id" element={<AdminLoanDetailScreen />} />
          <Route path="/admin/contributions" element={<AdminContributionsScreen />} />
          <Route path="/admin/officer-applications" element={<AdminOfficerApplicationsScreen />} />
          <Route path="/admin/ledger" element={<ComingSoonScreen title="Ledger" />} />
          <Route path="/admin/reports" element={<ComingSoonScreen title="Reports" />} />
        </Route>

        <Route path="/403" element={<ForbiddenScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Suspense>
  );
}
