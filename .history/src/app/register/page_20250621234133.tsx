"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Smartphone,
  User,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");
  const { register, loading } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setMessage("");
    setErrors({});

    const success = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phoneNumber: formData.phone,
    });

    if (success) {
      setMessage(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
      );
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setMessage("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen seamless-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card-prominent rounded-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-on-glass mb-2">Đăng ký</h1>
            <p className="text-secondary-glass">Tạo tài khoản mới tại Gear Shop</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-glass mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
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
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Xác nhận mật khẩu"
                required
              />
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={(e) => {}}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10 mt-1"
                  required
                />
                <span className="ml-2 text-sm text-white/70">
                  Tôi đồng ý với{" "}
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Điều khoản dịch vụ
                  </button>{" "}
                  và{" "}
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Chính sách bảo mật
                  </button>
                </span>
              </label>
            </div>

            {message && (
              <div className="bg-green-500/20 border border-green-400/30 text-green-100 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
