import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface User {
  _id: string;
  id: string; // alias of _id for compatibility
  name: string;
  name_ar?: string;
  email: string;
  phone?: string;
  country?: string;
  role: 'admin' | 'student';
  language: 'ar' | 'en';
  enrolledCourses: string[];
  createdAt: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (userData: any) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message: string }>;
  isAdmin: boolean;
  isStudent: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => ({ success: false, message: '' }),
  logout: () => {},
  register: async () => ({ success: false, message: '' }),
  updateProfile: async () => ({ success: false, message: '' }),
  isAdmin: false,
  isStudent: false,
  isAuthenticated: false,
});

function normalizeUser(u: any): User {
  return { ...u, id: u._id ?? u.id };
}

function getToken() {
  try { return localStorage.getItem('sa_token'); } catch { return null; }
}

let API_URL = import.meta.env.VITE_API_URL || '';
if (API_URL.endsWith('/api')) {
  API_URL = API_URL.slice(0, -4);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('sa_current_user');
      return saved ? normalizeUser(JSON.parse(saved)) : null;
    } catch { return null; }
  });

  // Validate token on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          const u = normalizeUser(data);
          setCurrentUser(u);
          localStorage.setItem('sa_current_user', JSON.stringify(u));
        } else {
          // token invalid — clear
          localStorage.removeItem('sa_token');
          localStorage.removeItem('sa_current_user');
          setCurrentUser(null);
        }
      })
      .catch(() => {});
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Login failed' };

      localStorage.setItem('sa_token', data.token);
      const u = normalizeUser(data.user);
      localStorage.setItem('sa_current_user', JSON.stringify(u));
      setCurrentUser(u);
      return { success: true, message: '' };
    } catch {
      return { success: false, message: 'Server unavailable. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_current_user');
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Registration failed' };
      return { success: true, message: '' };
    } catch {
      return { success: false, message: 'Server unavailable. Please try again.' };
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Update failed' };
      const u = normalizeUser(data);
      setCurrentUser(u);
      localStorage.setItem('sa_current_user', JSON.stringify(u));
      return { success: true, message: 'Profile updated' };
    } catch {
      return { success: false, message: 'Server unavailable.' };
    }
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Google login failed' };

      localStorage.setItem('sa_token', data.token);
      const u = normalizeUser(data.user);
      localStorage.setItem('sa_current_user', JSON.stringify(u));
      setCurrentUser(u);
      return { success: true, message: '' };
    } catch {
      return { success: false, message: 'Google login unavailable. Please try again.' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      login, logout, register, updateProfile, loginWithGoogle,
      isAdmin: currentUser?.role === 'admin',
      isStudent: currentUser?.role === 'student',
      isAuthenticated: !!currentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
