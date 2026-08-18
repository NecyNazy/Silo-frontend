import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import {
  applyForOfficer,
  approveOfficerApplication,
  getMyOfficerApplications,
  listPendingOfficerApplications,
  rejectOfficerApplication,
} from './api';

export function useMyOfficerApplications() {
  const memberId = useAuthStore((s) => s.memberId);
  return useQuery({
    queryKey: ['officer-applications', 'me', memberId],
    queryFn: () => getMyOfficerApplications(),
    enabled: Boolean(memberId),
  });
}

export function useApplyForOfficer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => applyForOfficer(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-applications'] });
    },
  });
}

export function usePendingOfficerApplications() {
  return useQuery({
    queryKey: ['officer-applications', 'pending'],
    queryFn: () => listPendingOfficerApplications(),
  });
}

export function useApproveOfficerApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveOfficerApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-applications'] });
    },
  });
}

export function useRejectOfficerApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectOfficerApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['officer-applications'] });
    },
  });
}
