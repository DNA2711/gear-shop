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
  LayoutDashboard,
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
import { getUserDisplayName } from "@/utils/userUtils";

export default function LoginButton() {
  const { user, isAuthenticated, logout, loading, loginLoading } = useAuth();
  const router = useRouter();

  // Debug log
  console.log("LoginButton - user:", user);
  console.log(
    "LoginButton - getUserDisplayName result:",
    getUserDisplayName(user)
  );

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Hiển thị loading state khi đang login
  if (loginLoading) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          disabled
          className="bg-transparent border-blue-400 text-blue-400 opacity-50"
        >
          <div className="w-4 h-4 mr-2 animate-spin border-2 border-blue-400 border-t-transparent rounded-full"></div>
          Đang đăng nhập...
        </Button>
      </div>
    );
  }

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

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-400 hover:bg-blue-400/10 transition-all duration-200 flex items-center space-x-2"
        >
          <UserAvatar user={user || undefined} size="sm" showStatus />
          <span className="hidden sm:inline">
            {user?.name || getUserDisplayName(user)}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 bg-gray-900 border-gray-700 text-white shadow-2xl">
        <DropdownMenuLabel className="text-blue-400 py-3">
          <div className="flex items-center space-x-3">
            <UserAvatar user={user || undefined} size="md" showStatus />
            <div>
              <p className="font-semibold text-white">
                {user?.name || getUserDisplayName(user)}
              </p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-700" />

        {isAdmin && (
          <>
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer py-2">
              <LayoutDashboard className="w-4 h-4 mr-3 text-purple-400" />
              <Link href="/admin" className="flex-1">
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
          </>
        )}

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
          disabled={loading}
          className="hover:bg-red-900 cursor-pointer text-red-400 hover:text-red-300 py-2"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {loading ? "Đang đăng xuất..." : "Đăng xuất"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
