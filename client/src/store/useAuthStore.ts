import { create } from 'zustand';
import { UserProfile } from '@novabank/shared';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateKycStatus: (status: any) => void;
  enableTwoFactor: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('novabank_access_token'),
  setAuth: (user, token) => {
    localStorage.setItem('novabank_access_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('novabank_access_token');
    set({ user: null, token: null });
  },
  updateKycStatus: (status) =>
    set((state) => (state.user ? { user: { ...state.user, kycStatus: status } } : state)),
  enableTwoFactor: () =>
    set((state) => (state.user ? { user: { ...state.user, isTwoFactorEnabled: true } } : state)),
}));
