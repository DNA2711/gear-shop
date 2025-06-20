"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { LoadingLink } from "@/components/ui/LoadingLink";
import HeaderDropdownMenu from "./header-dropdown-menu";
import HeaderShoppingCart from "./header-shopping-cart";
import LoginButton from "./login-button";
import { CategoryWithChildren } from "@/types/category";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  Atom,
  Heart,
  Bell,
  Zap,
  Cpu,
  Monitor,
  HardDrive,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      if (result.success) {
        setCategories(
          result.data.filter((cat: CategoryWithChildren) => cat.is_active)
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Popular categories để hiển thị trên navigation bar
  const popularCategories = [
    {
      name: "Gaming PC",
      icon: <Gamepad2 className="w-4 h-4" />,
      href: "/products?category=gaming",
      color: "text-green-400",
    },
    {
      name: "RTX 40 Series",
      icon: <Zap className="w-4 h-4" />,
      href: "/products?category=vga",
      color: "text-yellow-400",
    },
    {
      name: "AMD Ryzen",
      icon: <Cpu className="w-4 h-4" />,
      href: "/products?category=cpu",
      color: "text-red-400",
    },
    {
      name: "Gaming Monitor",
      icon: <Monitor className="w-4 h-4" />,
      href: "/products?category=monitor",
      color: "text-blue-400",
    },
    {
      name: "SSD NVMe",
      icon: <HardDrive className="w-4 h-4" />,
      href: "/products?category=storage",
      color: "text-purple-400",
    },
  ];

  return (
    <div>
      <>
        <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 backdrop-blur-md border-b border-blue-500/20 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse opacity-50"></div>
          </div>

          <div className="container flex items-center justify-between gap-5 h-24 relative">
            {/* Logo with scientific theme */}
            <LoadingLink
              href={"/"}
              loadingMessage="Đang chuyển về Trang chủ..."
              className="text-4xl font-bold select-none flex ml-4 items-center group transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Atom className="w-8 h-8 text-blue-400 animate-spin-slow group-hover:animate-spin" />
                <span className="text-white font-light tracking-wider">
                  Gear
                </span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-black px-3 py-1 rounded-lg font-medium tracking-wide transform group-hover:scale-110 transition-transform">
                  Hub
                </span>
              </div>
            </LoadingLink>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-20 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-full backdrop-blur-sm focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 transition-colors duration-200"
                >
                  Tìm
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="hidden lg:flex items-center gap-3 text-white">
              <LoadingLink
                href="/pc-builder"
                loadingMessage="Đang mở PC Builder..."
                className="flex items-center gap-2 hover:text-blue-400 hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-2"
              >
                🖥️
                <span className="hidden xl:inline">PC Builder</span>
              </LoadingLink>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-red-400 hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-2"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden xl:inline">Yêu thích</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-yellow-400 hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-2"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden xl:inline">Thông báo</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-green-400 hover:bg-white/10 transition-all duration-200 rounded-full px-3 py-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden xl:inline">Tài khoản</span>
              </Button>
            </div>

            {/* Right side with dropdown, cart, and login */}
            <div className="flex items-center gap-2 lg:gap-4">
              <HeaderDropdownMenu />
              <HeaderShoppingCart />
              <LoginButton />
            </div>
          </div>

          {/* Bottom glow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
        </header>

        {/* Popular Categories Navigation Bar */}
        <div className="fixed w-full top-24 z-40 bg-gray-800/95 backdrop-blur-lg border-b border-gray-700/50">
          <div className="container">
            <div className="flex items-center justify-between py-3">
              {/* Category Links */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                <span className="text-xs text-gray-400 font-medium mr-3 whitespace-nowrap">
                  PHỔ BIẾN:
                </span>
                {popularCategories.map((category, index) => (
                  <LoadingLink
                    key={index}
                    href={category.href}
                    loadingMessage={`Đang tải ${category.name}...`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200 hover:scale-105 group whitespace-nowrap"
                  >
                    <div
                      className={`${category.color} group-hover:scale-110 transition-transform`}
                    >
                      {category.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                      {category.name}
                    </span>
                  </LoadingLink>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="hidden lg:flex items-center gap-3 text-xs">
                <LoadingLink
                  href="/products?sort=newest"
                  loadingMessage="Đang tải sản phẩm mới..."
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Mới nhất
                </LoadingLink>
                <span className="text-gray-600">|</span>
                <LoadingLink
                  href="/products?sort=bestseller"
                  loadingMessage="Đang tải sản phẩm bán chạy..."
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Bán chạy
                </LoadingLink>
                <span className="text-gray-600">|</span>
                <LoadingLink
                  href="/products?sort=discount"
                  loadingMessage="Đang tải sản phẩm khuyến mãi..."
                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Khuyến mãi
                </LoadingLink>
              </div>
            </div>
          </div>
        </div>

      </>
    </div>
  );
}
