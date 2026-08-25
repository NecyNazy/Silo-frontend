import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { RegisterMemberInput } from '@/shared/types/member';
import { login, register, type LoginInput } from './api';
import { useAuthStore } from './store';

export function useAuth() {
  const { accessToken, role, memberId, isAuthenticated, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  return { accessToken, role, memberId, isAuthenticated, logout };
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
    onSuccess: (session) => {
      setSession(session);
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      navigate(next ?? '/dashboard');
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterMemberInput) => register(input),
    onSuccess: (session) => {
      setSession(session);
      navigate('/dashboard');
    },
  });
}
