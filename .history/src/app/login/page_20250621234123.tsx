"use client";

import { useState, Suspense } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const {
    login,
    loading,
    loginLoading,
    user,
    error: authError,
    clearError,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showWelcomeToast } = useToast();

  // Get redirect parameter từ URL
  const redirectPath = searchParams.get("redirect");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    clearError();

    const result = await login({
      username: formData.email,
      password: formData.password,
    });

    if (result.success && result.user) {
      const currentUser = result.user;

      // Chỉ hiển thị toast chào mừng cho user thường, không phải admin
      if (currentUser.role?.toLowerCase() !== "admin") {
        showWelcomeToast(currentUser);
      }

      // Redirect dựa trên role hoặc redirect parameter
      let targetPath = "/";

      if (currentUser.role?.toLowerCase() === "admin") {
        targetPath = "/admin";
      }

      // Nếu có redirect parameter và user có quyền truy cập
      if (redirectPath) {
        if (
          redirectPath === "/admin" &&
          currentUser.role?.toLowerCase() === "admin"
        ) {
          targetPath = "/admin";
        } else if (redirectPath !== "/admin") {
          targetPath = redirectPath;
        }
      }

      // Redirect ngay lập tức
      router.replace(targetPath);
    } else {
      setError(
        authError || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  return (
    <div className="min-h-screen seamless-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card-prominent rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-on-glass mb-2">Đăng nhập</h1>
            <p className="text-secondary-glass">Chào mừng trở lại Gear Shop</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-glass mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 glass-card rounded-lg text-on-glass placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-glass mb-2"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 glass-card rounded-lg text-on-glass placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10"
                />
                <span className="ml-2 text-sm text-white/70">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Quên mật khẩu?
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
