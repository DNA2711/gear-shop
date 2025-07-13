"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoadingLink } from "@/components/ui/LoadingLink";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Tag,
  List,
  Settings,
  Atom,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Quản lý thương hiệu", href: "/admin/brands", icon: Tag },
  { name: "Quản lý danh mục", href: "/admin/categories", icon: List },
  { name: "Quản lý sản phẩm", href: "/admin/products", icon: Package },
  { name: "Quản lý người dùng", href: "/admin/users", icon: Users },
  { name: "Quản lý đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Thống kê bán hàng", href: "/admin/statistics", icon: BarChart3 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 
        bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between h-16 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 border-b border-blue-500/30 px-4">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold select-none flex items-center group transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Atom className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 animate-spin-slow group-hover:animate-spin" />
              <span className="text-white font-light tracking-wider text-base sm:text-lg">
                Gear
              </span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-medium tracking-wide transform group-hover:scale-110 transition-transform text-sm">
                Hub
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 sm:mt-8 px-2 sm:px-0">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <LoadingLink
                key={item.name}
                href={item.href}
                loadingMessage={`Đang chuyển tới ${item.name}...`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`flex items-center mx-2 sm:mx-0 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-none text-left text-sm sm:text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white sm:border-r-4 border-blue-400 shadow-lg backdrop-blur-sm"
                    : "text-gray-300 hover:bg-white/10 hover:text-white sm:hover:border-r-2 sm:hover:border-blue-400/50"
                }`}
              >
                <item.icon
                  className={`mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                    isActive ? "text-blue-400" : ""
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </LoadingLink>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-center text-xs text-gray-400 bg-gray-800/50 rounded-lg p-3"></div>
        </div>
      </div>
    </>
  );
}
