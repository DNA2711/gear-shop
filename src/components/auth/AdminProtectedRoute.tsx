"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/ui/Loading";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (user && user.role?.toLowerCase() !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Hiển thị loading khi đang kiểm tra auth
  if (loading) {
    return <Loading message="Đang tải..." fullScreen />;
  }

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return null;
  }

  // Nếu không phải admin
  if (user && user.role?.toLowerCase() !== "admin") {
    return null;
  }

  // Cho phép truy cập admin
  return <>{children}</>;
}
