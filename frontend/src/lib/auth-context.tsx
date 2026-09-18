"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const response = await api.me();
      setUser(response.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!loading && pathname !== "/login" && pathname !== "/register" && !user) {
      router.push("/login");
    }
    if (!loading && (pathname === "/login" || pathname === "/register") && user) {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    await api.login({ email, password });
    await refreshUser();
    router.push("/");
  };

  const register = async (email: string, name: string, password: string) => {
    await api.register({ email, name, password });
    await refreshUser();
    router.push("/");
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}