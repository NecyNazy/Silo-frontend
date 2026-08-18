import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store';
import type { ApiError } from '../types/api';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
});

interface Envelope<T> {
  success: boolean;
  message: string | null;
  data: T;
  timestamp: string;
}

interface BackendErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  errors?: { field: string; message: string }[];
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only consumed by the MSW handlers that stand in for endpoints the real
  // backend doesn't expose yet (see tests/mocks/handlers/gaps.ts).
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'false') {
    const memberId = useAuthStore.getState().memberId;
    if (memberId) {
      config.headers['x-mock-member-id'] = memberId;
    }
  }

  return config;
});

apiClient.interceptors.response.use((response) => {
  const body = response.data as Envelope<unknown> | unknown;
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    response.data = (body as Envelope<unknown>).data;
  }
  return response;
});

function normalizeError(error: AxiosError<BackendErrorBody>): ApiError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data;
  const fieldErrors = body?.errors?.length
    ? Object.fromEntries(body.errors.map((e) => [e.field, e.message]))
    : undefined;

  return {
    status,
    message: body?.message || error.message || 'Something went wrong',
    fieldErrors,
  };
}

function redirectToLogin() {
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  if (window.location.pathname !== '/login') {
    window.location.assign(`/login?next=${next}`);
  }
}

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return Promise.resolve(null);

  refreshPromise ??= apiClient
    .post<{ accessToken: string; refreshToken: string; memberId: string; role: 'MEMBER' | 'OFFICER' }>(
      '/auth/refresh',
      { refreshToken },
    )
    .then(({ data }) => {
      useAuthStore.getState().setSession(data);
      return data.accessToken;
    })
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function isUnauthenticated(error: AxiosError<BackendErrorBody>): boolean {
  const status = error.response?.status;
  if (status === 401) return true;
  // A 403 with no body means the auth filter rejected the request outright
  // (missing/invalid token); a 403 with a body is a real role/permission denial.
  return status === 403 && !error.response?.data;
}

apiClient.interceptors.response.use(undefined, async (error: AxiosError<BackendErrorBody>) => {
  const config = error.config as RetryableConfig | undefined;
  const isAuthPath = config?.url?.startsWith('/auth/');

  if (isUnauthenticated(error) && config && !config._retry && !isAuthPath) {
    config._retry = true;
    const newToken = await refreshAccessToken();
    if (newToken) {
      config.headers.set('Authorization', `Bearer ${newToken}`);
      return apiClient.request(config);
    }
    useAuthStore.getState().clearSession();
    redirectToLogin();
  }

  return Promise.reject(normalizeError(error));
});
