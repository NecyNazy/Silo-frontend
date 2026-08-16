import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, type Role } from '../store';

export interface RoleGuardProps {
  role: Role;
  children: ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { isAuthenticated, role: currentRole } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole !== role) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
