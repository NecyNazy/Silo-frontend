import { create } from 'zustand';

const STORAGE_KEY = 'silo.session';

export type Role = 'MEMBER' | 'OFFICER';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  memberId: string;
  role: Role;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: Role | null;
  memberId: string | null;
  isAuthenticated: boolean;
  setSession: (session: SessionTokens) => void;
  clearSession: () => void;
  hydrate: () => void;
}

function persist(session: SessionTokens | null) {
  if (session) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  role: null,
  memberId: null,
  isAuthenticated: false,

  setSession: (session) => {
    persist(session);
    set({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      role: session.role,
      memberId: session.memberId,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    persist(null);
    set({
      accessToken: null,
      refreshToken: null,
      role: null,
      memberId: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const session = JSON.parse(raw) as SessionTokens;
      set({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        role: session.role,
        memberId: session.memberId,
        isAuthenticated: true,
      });
    } catch {
      persist(null);
    }
  },
}));

useAuthStore.getState().hydrate();
