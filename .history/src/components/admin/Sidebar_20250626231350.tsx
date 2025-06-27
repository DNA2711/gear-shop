"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoadingLink } from "@/components/ui/LoadingLink";
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
  { name: "Quản lý khách hàng", href: "/admin/users", icon: Users },
  { name: "Quản lý đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Thống kê bán hàng", href: "/admin/statistics", icon: BarChart3 },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 shadow-xl">
      <div className="flex items-center justify-center h-16 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 border-b border-blue-500/30">
        <Link
          href="/"
          className="text-2xl font-bold select-none flex items-center group transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <Atom className="w-8 h-8 text-blue-400 animate-spin-slow group-hover:animate-spin" />
            <span className="text-white font-light tracking-wider">Gear</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-black px-3 py-1 rounded-lg font-medium tracking-wide transform group-hover:scale-110 transition-transform">
              Hub
            </span>
          </div>
        </Link>
      </div>
      <nav className="mt-8">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <LoadingLink
              key={item.name}
              href={item.href}
              loadingMessage={`Đang chuyển tới ${item.name}...`}
              className={`flex items-center px-6 py-3 text-left text-base font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white border-r-4 border-blue-400 shadow-lg backdrop-blur-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white hover:border-r-2 hover:border-blue-400/50"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${isActive ? "text-blue-400" : ""}`}
              />
              {item.name}
            </LoadingLink>
          );
        })}
      </nav>
    </div>
  );
}
