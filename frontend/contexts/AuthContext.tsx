'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from '@/lib/types';
import {
  setApiTokenGetter,
  setApiOnUnauthorized,
  getCurrentUser,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from '@/lib/api';

const TOKEN_KEY = 'blog_token';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<{ error?: string; errors?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  useEffect(() => {
    setApiTokenGetter(getToken);
    setApiOnUnauthorized(() => {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    });
    return () => {
      setApiOnUnauthorized(() => {});
    };
  }, [getToken]);

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const { data, status } = await getCurrentUser();
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } else if (data?.user) {
      setUser(data.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const { data, error, status } = await apiLogin({ email, password });
      if (status === 401) {
        return { error: error?.message ?? 'Invalid credentials' };
      }
      if (error) {
        return {
          error:
            (error as { message?: string }).message ??
            (error as { errors?: Record<string, string[]> }).errors?.email?.[0] ??
            'Login failed',
        };
      }
      if (data?.access_token && data?.user) {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setUser(data.user);
      }
      return {};
    },
    []
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
    }): Promise<{ error?: string; errors?: Record<string, string[]> }> => {
      const result = await apiRegister(data);
      if (result.error) {
        const err = result.error as { message?: string; errors?: Record<string, string[]> };
        return {
          error: err.message ?? 'Registration failed',
          errors: err.errors,
        };
      }
      if (result.data?.access_token && result.data?.user) {
        localStorage.setItem(TOKEN_KEY, result.data.access_token);
        setUser(result.data.user);
      }
      return {};
    },
    []
  );

  const logout = useCallback(async () => {
    await apiLogout();
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, loadUser }),
    [user, loading, login, register, logout, loadUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
