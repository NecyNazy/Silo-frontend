import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { useAuthStore } from '@/features/auth/store';
import { MemberLayout } from './layouts/MemberLayout';
import { OfficerLayout } from './layouts/OfficerLayout';
import { ComingSoonScreen } from './screens/ComingSoonScreen';
import { ForbiddenScreen } from './screens/ForbiddenScreen';
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
const ContributionsScreen = lazyScreen(
  () => import('@/features/contribution/screens/ContributionsScreen'),
  'ContributionsScreen',
);
const MyLoansScreen = lazyScreen(
  () => import('@/features/loan/screens/MyLoansScreen'),
  'MyLoansScreen',
);
const LoanApplyScreen = lazyScreen(
  () => import('@/features/loan/screens/LoanApplyScreen'),
  'LoanApplyScreen',
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
const GuarantorInvitesScreen = lazyScreen(
  () => import('@/features/loan/screens/GuarantorInvitesScreen'),
  'GuarantorInvitesScreen',
);
const NotificationsScreen = lazyScreen(
  () => import('@/features/notification/screens/NotificationsScreen'),
  'NotificationsScreen',
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
const AdminLoanRequestsScreen = lazyScreen(
  () => import('@/features/loan/screens/AdminLoanRequestsScreen'),
  'AdminLoanRequestsScreen',
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

function RouteFallback() {
  return <div className="p-8 text-sm text-slate-400 dark:text-slate-500">Loading…</div>;
}

function HomeRedirect() {
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'OFFICER' ? '/admin/dashboard' : '/dashboard'} replace />;
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        <Route
          element={
            <AuthGuard>
              <MemberLayout />
            </AuthGuard>
          }
        >
          <Route path="/dashboard" element={<MemberDashboardScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/contributions" element={<ContributionsScreen />} />
          <Route path="/loans" element={<MyLoansScreen />} />
          <Route path="/loans/apply" element={<LoanApplyScreen />} />
          <Route path="/loans/:id" element={<LoanDetailScreen />} />
          <Route path="/loans/:id/guarantors/add" element={<AddGuarantorScreen />} />
          <Route path="/loans/:id/repay" element={<RepayScreen />} />
          <Route path="/guarantor-invites" element={<GuarantorInvitesScreen />} />
          <Route
            path="/guarantor-liabilities"
            element={<ComingSoonScreen title="Guarantor liabilities" />}
          />
          <Route path="/notifications" element={<NotificationsScreen />} />
        </Route>

        <Route
          element={
            <RoleGuard role="OFFICER">
              <OfficerLayout />
            </RoleGuard>
          }
        >
          <Route path="/admin/dashboard" element={<OfficerDashboardScreen />} />
          <Route path="/admin/members" element={<AdminMembersScreen />} />
          <Route path="/admin/members/:id" element={<AdminMemberDetailScreen />} />
          <Route path="/admin/loan-requests" element={<AdminLoanRequestsScreen />} />
          <Route path="/admin/loan-requests/:id" element={<AdminLoanRequestDetailScreen />} />
          <Route path="/admin/loans" element={<AdminLoansScreen />} />
          <Route path="/admin/loans/:id" element={<AdminLoanDetailScreen />} />
          <Route path="/admin/contributions" element={<AdminContributionsScreen />} />
          <Route path="/admin/ledger" element={<ComingSoonScreen title="Ledger" />} />
          <Route path="/admin/reports" element={<ComingSoonScreen title="Reports" />} />
        </Route>

        <Route path="/403" element={<ForbiddenScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Suspense>
  );
}
