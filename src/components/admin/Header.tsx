"use client";

import {
  Bell,
  User,
  LogOut,
  Search,
  LayoutDashboard,
  Settings,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-lg border-b border-blue-500/30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-lg backdrop-blur-sm focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-300">admin@gearshop.com</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-900" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-600 text-white shadow-2xl mr-4">
                <DropdownMenuLabel className="text-blue-400 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Admin User</p>
                      <p className="text-sm text-gray-300">
                        admin@gearshop.com
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-600" />

                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer py-2">
                  <LayoutDashboard className="w-4 h-4 mr-3 text-blue-400" />
                  <Link href="/admin" className="flex-1">
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer py-2">
                  <UserCircle className="w-4 h-4 mr-3 text-green-400" />
                  <Link href="/profile" className="flex-1">
                    Hồ sơ cá nhân
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer py-2">
                  <Settings className="w-4 h-4 mr-3 text-gray-400" />
                  <Link href="/admin/settings" className="flex-1">
                    Cài đặt Admin
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-600" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-red-900 cursor-pointer text-red-400 hover:text-red-300 py-2"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
