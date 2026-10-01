"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // The backend owns the HttpOnly session cookie. The browser cannot read or
  // overwrite it, so the role is always fetched from the authenticated session.
  useEffect(() => {
    async function restoreSession() {
      try {
        const meRes = await authAPI.getMe();
        if (meRes.success && meRes.data) {
          setUser(meRes.data);
        }
      } catch {
        // An absent or expired cookie is an unauthenticated state, not a
        // frontend-authentication failure.
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Login handler connected to backend
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        return response;
      }
      throw new Error(response.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Register handler connected to backend
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      return response;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
    }
  };

  const role = user?.role ?? null;
  const permissions = user?.permissions ?? [];
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        permissions,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
