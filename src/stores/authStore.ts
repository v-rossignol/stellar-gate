import { create } from 'zustand';
import type { User } from '@/types/auth';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/helpers';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(username, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Login failed'), isLoading: false });
      throw error;
    }
  },

  register: async (username, password, email) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(username, password, email);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Registration failed'), isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error, 'Logout failed'),
      });
    }
  },

  restoreSession: async () => {
    set({ isInitializing: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isInitializing: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
