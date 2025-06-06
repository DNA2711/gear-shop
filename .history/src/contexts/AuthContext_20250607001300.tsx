"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_CONFIG, apiRequest } from "@/config/api";
import { handleApiError } from "@/utils/errorHandling";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Kiểm tra auth status khi app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      console.log("Checking auth status, token exists:", !!token); // Debug log

      if (!token) {
        console.log("No token found, user not authenticated"); // Debug log
        setIsLoading(false);
        return;
      }

      console.log("Fetching user profile..."); // Debug log
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
        method: "GET",
      });

      console.log("Profile response status:", response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("Profile data received:", data); // Debug log
        setUser(data);
      } else {
        // Token không hợp lệ, xóa token
        console.log("Invalid token, removing from localStorage"); // Debug log
        localStorage.removeItem("auth-token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("auth-token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      console.log("Login attempt with:", { email }); // Debug log

      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("Login response data:", data); // Debug log

        // Backend có thể trả về token với key khác nhau
        const token = data.token || data.accessToken || data.access_token;
        if (token) {
          localStorage.setItem("auth-token", token);
          console.log("Token saved to localStorage"); // Debug log
        } else {
          console.warn("No token found in response:", data); // Debug log
        }

        // Backend có thể trả về user info với structure khác nhau
        let userInfo = data.user || data.data || data;
        
        // Normalize user data structure
        if (userInfo) {
          userInfo = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name || userInfo.fullName || userInfo.full_name || userInfo.username,
            role: userInfo.role || 'user',
            ...userInfo
          };
        }
        
        setUser(userInfo);
        console.log("User info set:", userInfo); // Debug log

        return { success: true, message: "Đăng nhập thành công" };
      } else {
        const errorMessage = await handleApiError(response);
        console.log("Login error:", errorMessage); // Debug log
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message:
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setIsLoading(true);
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      if (response.ok) {
        return { success: true, message: "Đăng ký thành công" };
      } else {
        const errorMessage = await handleApiError(response);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Register failed:", error);
      return {
        success: false,
        message:
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (token) {
        // Gọi API logout nếu cần (tùy backend có endpoint logout không)
        // await apiRequest("/auth/logout", {
        //   method: "POST",
        // });
      }

      // Xóa token và user info
      localStorage.removeItem("auth-token");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Vẫn logout ở frontend
      localStorage.removeItem("auth-token");
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
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
