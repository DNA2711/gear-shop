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

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Load user from localStorage on mount
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  // Load user data from localStorage
  const loadUserFromStorage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token and get user profile
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, clear storage
        clearAuthStorage();
      }
    } catch (error) {
      console.error("Error loading user:", error);
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  // Clear authentication storage
  const clearAuthStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Clear cookie
    document.cookie = `accessToken=; path=/; max-age=0`;
    setUser(null);
  };

  // Login function
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

        // Store tokens
        localStorage.setItem("accessToken", loginData.accessToken);
        localStorage.setItem("refreshToken", loginData.refreshToken);

        // Also set token in cookie for middleware access
        document.cookie = `accessToken=${loginData.accessToken}; path=/; max-age=3600; SameSite=strict`;

        // Load complete user profile ngay lập tức
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
          // Fallback user data nếu không load được profile
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

  // Register function
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

  // Logout function
  const logout = () => {
    clearAuthStorage();
    setError(null);
  };

  // Refresh token function
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

  // Clear error function
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

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protected routes
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
      // This will be handled by middleware, but just in case
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
