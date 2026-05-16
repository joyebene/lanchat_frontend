'use client';

import { authApi } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('lanchat_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('lanchat_user');
          return null;
        }
      }
    }
    return null;
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ['/', '/login', '/register'];
    const isPublicPath = publicPaths.includes(pathname);

    // If there's no user and the current path is not public, redirect to login.
    if (!user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, router, pathname]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login({ email, password });
      const { accessToken, user: userData } = data;

      // Store token and user data
      localStorage.setItem('lanchat_token', accessToken);
      localStorage.setItem('lanchat_user', JSON.stringify(userData));

      // Set user state and connect to socket
      setUser(userData);

      toast.success(`Welcome ${userData.username}!`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      // Ensure user state is cleared on failed login
      setUser(null);
      localStorage.removeItem('lanchat_token');
      localStorage.removeItem('lanchat_user');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lanchat_token');
    localStorage.removeItem('lanchat_user');
  
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};