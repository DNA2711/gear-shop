"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_CONFIG, apiRequest } from "@/config/api";

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
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.PROFILE, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        // Token không hợp lệ, xóa token
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
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Lưu token vào localStorage
        if (data.token) {
          localStorage.setItem("auth-token", data.token);
        }

        // Lấy thông tin user
        setUser(data.user || data);
        return { success: true, message: "Đăng nhập thành công" };
      } else {
        // Handle different HTTP status codes
        let errorMessage = "Đăng nhập thất bại";

        if (response.status === 401) {
          errorMessage = "Email hoặc mật khẩu không chính xác";
        } else if (response.status === 404) {
          errorMessage = "Tài khoản không tồn tại";
        } else if (response.status >= 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau";
        } else {
          try {
            const data = await response.json();
            if (
              data.message &&
              !data.message.includes("JDBC") &&
              !data.message.includes("SQL")
            ) {
              errorMessage = data.message;
            }
          } catch {
            // Ignore JSON parse error
          }
        }

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
        // Handle different HTTP status codes
        let errorMessage = "Đăng ký thất bại";

        if (response.status === 409) {
          errorMessage = "Email đã được sử dụng";
        } else if (response.status === 400) {
          errorMessage = "Thông tin đăng ký không hợp lệ";
        } else if (response.status >= 500) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau";
        } else {
          try {
            const data = await response.json();
            if (
              data.message &&
              !data.message.includes("JDBC") &&
              !data.message.includes("SQL")
            ) {
              errorMessage = data.message;
            }
          } catch {
            // Ignore JSON parse error
          }
        }

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
