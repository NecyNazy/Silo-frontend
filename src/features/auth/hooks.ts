import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, register, type LoginInput } from './api';
import { useAuthStore } from './store';
import type { RegisterMemberInput } from '@/shared/types/member';

export function useAuth() {
  const { token, role, memberId, isAuthenticated, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  return { token, role, memberId, isAuthenticated, logout };
}

export function useRequireRole(role: 'MEMBER' | 'OFFICER') {
  const currentRole = useAuthStore((s) => s.role);
  return currentRole === role;
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: ({ token }) => {
      setSession(token);
      const role = useAuthStore.getState().role;
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      navigate(next ?? (role === 'OFFICER' ? '/admin/dashboard' : '/dashboard'));
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterMemberInput) => register(input),
    onSuccess: () => {
      navigate('/login', { state: { justRegistered: true } });
    },
  });
}
