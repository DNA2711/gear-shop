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
import { UserAvatar } from "@/components/ui/UserAvatar";

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
          className="text-blue-400 hover:bg-blue-400/10 transition-all duration-200 flex items-center space-x-2"
        >
          <UserAvatar user={user || undefined} size="sm" showStatus />
          <span className="hidden sm:inline">{user?.name || "User"}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700 text-white shadow-2xl">
        <DropdownMenuLabel className="text-blue-400 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name || "User"}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer py-2">
          <User className="w-4 h-4 mr-3 text-blue-400" />
          <Link href="/profile" className="flex-1">
            Hồ sơ cá nhân
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer py-2">
          <ShoppingBag className="w-4 h-4 mr-3 text-green-400" />
          <Link href="/orders" className="flex-1">
            Đơn hàng của tôi
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer py-2">
          <Heart className="w-4 h-4 mr-3 text-pink-400" />
          <Link href="/wishlist" className="flex-1">
            Danh sách yêu thích
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer py-2">
          <Settings className="w-4 h-4 mr-3 text-gray-400" />
          <Link href="/settings" className="flex-1">
            Cài đặt
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="hover:bg-red-900 cursor-pointer text-red-400 hover:text-red-300 py-2"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
