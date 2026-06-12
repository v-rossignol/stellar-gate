import type { AuthResponse, User } from '@/types/auth';
import type { SuccessResponse } from '@/types/api';
import { api } from './api';

export const authService = {
  async login(username: string, password: string): Promise<User> {
    const response = await api.post<AuthResponse>('/login', { username, password });
    return response.data.user;
  },

  async register(username: string, password: string, email?: string): Promise<User> {
    const body: { username: string; password: string; email?: string } = { username, password };
    if (email) {
      body.email = email;
    }
    const response = await api.post<AuthResponse>('/register', body);
    return response.data.user;
  },

  async logout(): Promise<void> {
    await api.post<SuccessResponse>('/logout');
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post<SuccessResponse>('/forgot-password', { email });
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>('/me');
      return response.data;
    } catch {
      return null;
    }
  },
};
