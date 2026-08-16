import axios, { AxiosError } from 'axios';
import { getAuthToken, useAuthStore } from '@/features/auth/store';
import type { ApiError } from '../types/api';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.VITE_ENABLE_MOCKS !== 'false') {
    const memberId = useAuthStore.getState().memberId;
    if (memberId) {
      config.headers['x-mock-member-id'] = memberId;
    }
  }

  return config;
});

interface BackendErrorBody {
  message?: string;
  error?: string;
  code?: string;
  errors?: Record<string, string>;
}

function normalizeError(error: AxiosError<BackendErrorBody>): ApiError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data;

  return {
    status,
    message: body?.message ?? body?.error ?? error.message ?? 'Something went wrong',
    code: body?.code,
    fieldErrors: body?.errors,
  };
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorBody>) => {
    const apiError = normalizeError(error);

    if (apiError.status === 401) {
      useAuthStore.getState().clearSession();
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      if (window.location.pathname !== '/login') {
        window.location.assign(`/login?next=${next}`);
      }
    }

    return Promise.reject(apiError);
  },
);
