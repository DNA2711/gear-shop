"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { LoadingLink } from "@/components/ui/LoadingLink";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!email || !email.trim()) {
        toast.error("Vui lòng nhập email");
        return;
      }

      if (isLoading) {
        return; // Prevent double submission
      }

      setIsLoading(true);

      try {
        console.log("🚀 Sending forgot password request for:", email);

        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({ email: email.trim() }),
        });

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log("📝 Raw response:", responseText);

        const responseData = JSON.parse(responseText);
        console.log("🔍 Parsed responseData:", responseData);
        console.log("🔍 responseData.success type:", typeof responseData.success);
        console.log("🔍 responseData.success value:", responseData.success);

        // Check if response indicates success
        const isSuccess = responseData.success === true;
        console.log("✅ isSuccess:", isSuccess);

        if (isSuccess) {
          console.log("🎉 Success path - setting submitted");
          setIsSubmitted(true);
          toast.success(responseData.message || "Email đã được gửi thành công");

          // Development mode debug
          if (responseData.resetUrl) {
            console.log("🔗 Reset URL:", responseData.resetUrl);
            toast("Development Mode: Check console for reset link");
          }
        } else {
          console.log("❌ Error path - showing error");
          toast.error(responseData.message || "Có lỗi xảy ra, vui lòng thử lại");
        }
      } catch (error) {
        console.error("💥 Request failed:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      } finally {
        console.log("🏁 Finally - setting loading false");
        setIsLoading(false);
      }
    },
    [email, isLoading, toast]
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email đã được gửi!
            </h1>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Chúng tôi đã gửi link reset mật khẩu đến email{" "}
              <strong>{email}</strong>. Vui lòng kiểm tra email và làm theo
              hướng dẫn.
            </p>

            <div className="space-y-4">
              <LoadingLink
                href="/login"
                loadingMessage="Đang chuyển đến trang đăng nhập..."
                className="w-full"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg">
                  Quay lại đăng nhập
                </Button>
              </LoadingLink>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full text-gray-500 hover:text-gray-700 py-2 font-medium transition-colors"
              >
                Gửi lại email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quên mật khẩu?
            </h1>

            <p className="text-gray-600 leading-relaxed">
              Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi link để reset
              mật khẩu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Địa chỉ email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang gửi...
                </div>
              ) : (
                "Gửi link reset mật khẩu"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <LoadingLink
              href="/login"
              loadingMessage="Đang chuyển đến trang đăng nhập..."
              className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </LoadingLink>
          </div>

          {/* Help */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Không nhận được email?</p>
                <p>
                  Kiểm tra thư mục spam hoặc liên hệ support nếu cần hỗ trợ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
