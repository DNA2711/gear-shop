"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";
import Link from "next/link";

const LoginButton = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.full_name) return user.full_name;
    if (user.email) {
      const name = user.email.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return "User";
  };

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-gray-700 text-sm">
          Chào {getUserDisplayName()}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Link
        href="/login"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
      >
        <User className="h-4 w-4" />
        <span>Đăng nhập</span>
      </Link>
      <Link
        href="/register"
        className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
      >
        Đăng ký
      </Link>
    </div>
  );
};

export default LoginButton;
