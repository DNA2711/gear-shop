"use client";

import {
  User,
  LogIn,
  UserCircle,
  Settings,
  LogOut,
  UserPlus,
  ShoppingBag,
  Heart,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginButton() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button
            variant="outline"
            className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-200"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Đăng nhập
          </Button>
        </Link>
        <Link href="/register">
          <Button
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Đăng ký
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
        >
          <UserCircle className="w-5 h-5 mr-2" />
          {user?.name || user?.email || "User"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 text-white">
        <DropdownMenuLabel className="text-blue-400">
          Tài khoản
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Hồ sơ cá nhân
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Cài đặt
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:bg-red-900 cursor-pointer text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
