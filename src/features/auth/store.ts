import { create } from 'zustand';
import { decodeJwt, type DecodedToken } from './lib/jwt';

const STORAGE_KEY = 'silo.session';

interface StoredSession {
  token: string;
  role: DecodedToken['role'];
  memberId: string;
  expiresAt: number;
}

interface AuthState {
  token: string | null;
  role: DecodedToken['role'] | null;
  memberId: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  setSession: (token: string) => void;
  clearSession: () => void;
  hydrate: () => void;
}

function persist(session: StoredSession | null) {
  if (session) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  memberId: null,
  expiresAt: null,
  isAuthenticated: false,

  setSession: (token) => {
    const decoded = decodeJwt(token);
    if (!decoded) return;

    const session: StoredSession = {
      token,
      role: decoded.role,
      memberId: decoded.memberId,
      expiresAt: decoded.exp * 1000,
    };
    persist(session);
    set({
      token: session.token,
      role: session.role,
      memberId: session.memberId,
      expiresAt: session.expiresAt,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    persist(null);
    set({ token: null, role: null, memberId: null, expiresAt: null, isAuthenticated: false });
  },

  hydrate: () => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const session = JSON.parse(raw) as StoredSession;
      if (session.expiresAt <= Date.now()) {
        persist(null);
        return;
      }
      set({
        token: session.token,
        role: session.role,
        memberId: session.memberId,
        expiresAt: session.expiresAt,
        isAuthenticated: true,
      });
    } catch {
      persist(null);
    }
  },
}));

useAuthStore.getState().hydrate();

export function getAuthToken(): string | null {
  return useAuthStore.getState().token;
}
