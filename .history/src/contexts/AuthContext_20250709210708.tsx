"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  LoginForm,
  SignupForm,
  LoginResponse,
  ApiResponse,
} from "@/types/auth";
import { clearAllCartDataFromStorage } from "@/utils/cartUtils";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginLoading: boolean;
  error: string | null;
  login: (credentials: LoginForm) => Promise<{ success: boolean; user?: User }>;
  register: (
    userData: SignupForm
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    loadUserFromStorage();
  }, []);
  const loadUserFromStorage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        clearAuthStorage();
      }
    } catch (error) {
      console.error("Error loading user:", error);
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    document.cookie = `accessToken=; path=/; max-age=0`;
    setUser(null);
  };
  const login = async (
    credentials: LoginForm
  ): Promise<{ success: boolean; user?: User }> => {
    try {
      setLoginLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const loginData: LoginResponse = await response.json();

        localStorage.setItem("accessToken", loginData.accessToken);
        localStorage.setItem("refreshToken", loginData.refreshToken);

        document.cookie = `accessToken=${loginData.accessToken}; path=/; max-age=3600; SameSite=strict`;
        const userResponse = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${loginData.accessToken}`,
          },
        });

        let userData: User;
        if (userResponse.ok) {
          userData = await userResponse.json();
          setUser(userData);
        } else {
          userData = {
            id: 0,
            name: loginData.fullName || "",
            username: credentials.username,
            email: credentials.username,
            role: loginData.role || "USER",
            enabled: true,
            createdAt: new Date().toISOString(),
          };
          setUser(userData);
        }

        return { success: true, user: userData };
      } else {
        const errorData = await response.json();

        setError(errorData.message || "Đăng nhập thất bại");
        return { success: false };
      }
    } catch (error) {
      setError("Lỗi kết nối. Vui lòng thử lại.");
      console.error("Login error:", error);
      return { success: false };
    } finally {
      setLoginLoading(false);
    }
  };

  const register = async (
    userData: SignupForm
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Registration successful
        const successData = await response.json();
        setError(null);
        return {
          success: true,
          message: successData.message || "Đăng ký thành công!",
        };
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Đăng ký thất bại";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Lỗi kết nối. Vui lòng thử lại.";
      setError(errorMessage);
      console.error("Register error:", error);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAllCartDataFromStorage();
    clearAuthStorage();
    setError(null);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("refreshToken");

      if (!token) {
        logout();
        return false;
      }

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const tokenData: LoginResponse = await response.json();

        // Update tokens
        localStorage.setItem("accessToken", tokenData.accessToken);
        localStorage.setItem("refreshToken", tokenData.refreshToken);

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    loginLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export default AuthContext;
