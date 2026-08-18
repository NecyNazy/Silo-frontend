import { apiClient } from '@/shared/api/client';
import type { OfficerApplication } from '@/shared/types/officerApplication';

export async function applyForOfficer(): Promise<OfficerApplication> {
  const { data } = await apiClient.post<OfficerApplication>('/officer-applications');
  return data;
}

export async function getMyOfficerApplications(): Promise<OfficerApplication[]> {
  const { data } = await apiClient.get<OfficerApplication[]>('/officer-applications/me');
  return data;
}

export async function listPendingOfficerApplications(): Promise<OfficerApplication[]> {
  const { data } = await apiClient.get<OfficerApplication[]>('/officer-applications/pending');
  return data;
}

export async function approveOfficerApplication(id: string): Promise<OfficerApplication> {
  const { data } = await apiClient.post<OfficerApplication>(`/officer-applications/${id}/approve`);
  return data;
}

export async function rejectOfficerApplication(id: string): Promise<OfficerApplication> {
  const { data } = await apiClient.post<OfficerApplication>(`/officer-applications/${id}/reject`);
  return data;
}
