'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

type User = {
  id: number;
  email: string;
  role: string;
};

type JwtPayload = {
  sub: number;
  email: string;
  role: string;
  exp: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('accessToken');
        setIsLoading(false);
        return;
      }

      setUser({
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      });
    } catch {
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('accessToken', data.accessToken);

    const decoded = jwtDecode<JwtPayload>(data.accessToken);

    setUser({
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    });
    if (decoded.role === 'ADMIN') {
        router.replace('/admin');
        } else {
        router.replace('/projects');
    }
  }
    function logout() {
        localStorage.removeItem('accessToken');
        setUser(null);
        router.replace('/');
    }

  return (
    <AuthContext.Provider value={{ user, isLoading, login,logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}