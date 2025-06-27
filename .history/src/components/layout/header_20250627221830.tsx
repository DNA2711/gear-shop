"use client";

import { useState, useEffect, useRef } from "react";
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
import { NotificationBell } from "@/components/ui/NotificationBell";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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

  // Handle search functionality
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear search after redirect
      setShowSuggestions(false); // Hide suggestions
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && searchSuggestions[selectedIndex]) {
        handleSuggestionClick(searchSuggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  // Fetch search suggestions
  const fetchSearchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetch(
        `/api/search/smart-suggestions?q=${encodeURIComponent(query)}&limit=8`
      );
      if (response.ok) {
        const suggestions = await response.json();
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change with instant search option
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1); // Reset selection when typing

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Option 1: Instant search (recommended) - ĐANG SỬ DỤNG
    fetchSearchSuggestions(value);

    // Option 2: Fast debounce (100ms) - TẮT ĐI
    // timeoutRef.current = setTimeout(() => {
    //   fetchSearchSuggestions(value);
    // }, 100);
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (product: any) => {
    router.push(`/products/${product.product_id}`);
    setSearchTerm("");
    setShowSuggestions(false);
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
            {/* Left side with logo and categories menu */}
            <div className="flex items-center gap-4 ml-6">
              {/* Logo with scientific theme */}
              <LoadingLink
                href={"/"}
                loadingMessage="Đang chuyển về Trang chủ..."
                className="text-4xl font-bold select-none flex items-center group transition-all duration-300 hover:scale-105"
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

              {/* Categories Menu */}
              <HeaderDropdownMenu />
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  onFocus={() => searchTerm && setShowSuggestions(true)}
                  onBlur={() => {
                    // Delay để cho phép click vào suggestion
                    setTimeout(() => {
                      setShowSuggestions(false);
                      setSelectedIndex(-1);
                    }, 200);
                  }}
                  className="w-full pl-10 pr-20 py-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-full backdrop-blur-sm focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                />
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 transition-colors duration-200 z-10"
                >
                  {searchLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Tìm"
                  )}
                </Button>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 glass-effect rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 max-h-[500px] overflow-y-auto animate-in search-dropdown">
                    {searchSuggestions.length > 0 ? (
                      <>
                        {/* Header với gradient */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-gray-700">
                                Gợi ý cho "{searchTerm}"
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                              {searchSuggestions.length} kết quả
                            </span>
                          </div>
                        </div>

                        {/* Products List */}
                        <div className="p-2">
                          {searchSuggestions.map((product, index) => (
                            <div
                              key={product.product_id}
                              onClick={() => handleSuggestionClick(product)}
                              className={`group flex items-center p-3 md:p-4 cursor-pointer transition-all duration-200 rounded-xl mx-1 my-1 border transform hover:scale-[1.02] ${
                                selectedIndex === index
                                  ? "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 shadow-lg scale-[1.02]"
                                  : "border-transparent hover:border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:shadow-lg"
                              }`}
                            >
                              {/* Product Image với loading state */}
                              <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mr-3 md:mr-4 flex-shrink-0 shadow-md">
                                {product.primary_image ? (
                                  <img
                                    src={product.primary_image}
                                    alt={product.product_name}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "/images/placeholder.jpg";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                    <Search className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
                                  </div>
                                )}
                                {/* Badge số thứ tự */}
                                <div className="absolute -top-1 -left-1 w-4 h-4 md:w-5 md:h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                  {index + 1}
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <h3 className="text-xs md:text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                                  {product.product_name}
                                </h3>

                                {/* Brand và Category */}
                                <div className="flex items-center space-x-1 md:space-x-2 text-xs">
                                  <span className="bg-purple-100 text-purple-700 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-medium text-xs">
                                    {product.brand_name}
                                  </span>
                                  <span className="text-gray-400 hidden md:inline">
                                    •
                                  </span>
                                  <span className="bg-gray-100 text-gray-600 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs hidden md:inline">
                                    {product.category_name}
                                  </span>
                                </div>

                                {/* Price với animation */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1 md:space-x-2">
                                    <span className="text-sm md:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                      {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                        notation: "compact",
                                        maximumFractionDigits: 0,
                                      }).format(product.price)}
                                    </span>
                                    {product.original_price &&
                                      product.original_price >
                                        product.price && (
                                        <span className="text-xs text-gray-400 line-through hidden md:inline">
                                          {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                            notation: "compact",
                                            maximumFractionDigits: 0,
                                          }).format(product.original_price)}
                                        </span>
                                      )}
                                  </div>

                                  {/* Stock status */}
                                  <div className="flex items-center space-x-1">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        product.stock_quantity > 0
                                          ? "bg-green-400"
                                          : "bg-red-400"
                                      }`}
                                    ></div>
                                    <span
                                      className={`text-xs ${
                                        product.stock_quantity > 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      } hidden md:inline`}
                                    >
                                      {product.stock_quantity > 0
                                        ? "Còn hàng"
                                        : "Hết hàng"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Arrow với animation */}
                              <div className="ml-2 md:ml-3 text-gray-400 group-hover:text-blue-500 transition-all duration-200 transform group-hover:translate-x-1">
                                <svg
                                  className="w-4 h-4 md:w-5 md:h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          ))}

                          {/* Footer với gradient */}
                          {searchSuggestions.length === 8 && (
                            <div
                              onClick={handleSearch}
                              className="group mt-2 mx-1 p-3 md:p-4 text-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 cursor-pointer transition-all duration-300 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <Search className="w-4 h-4" />
                                <span className="font-medium text-sm md:text-base">
                                  Xem tất cả kết quả cho "{searchTerm}"
                                </span>
                                <svg
                                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : searchTerm.length > 0 && !searchLoading ? (
                      /* Empty State */
                      <div className="p-6 md:p-8 text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                          Không tìm thấy sản phẩm
                        </h3>
                        <p className="text-sm md:text-base text-gray-500 mb-4">
                          Không có sản phẩm nào phù hợp với "{searchTerm}"
                        </p>
                        <button
                          onClick={handleSearch}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm md:text-base"
                        >
                          Tìm kiếm nâng cao
                        </button>
                      </div>
                    ) : searchLoading ? (
                      /* Loading State */
                      <div className="p-6 md:p-8 text-center">
                        <div className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-4 border-2 md:border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-sm md:text-base text-gray-500">
                          Đang tìm kiếm...
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="hidden lg:flex items-center gap-3 text-white">
              <LoadingLink
                href="/pc-builder"
                loadingMessage="Đang mở PC Builder..."
                className="relative group"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105">
                  <span className="text-lg">🖥️</span>
                  <span className="hidden xl:inline text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                    PC Builder
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300"></div>
                </div>
              </LoadingLink>

              {/* Notification Bell - only show when user is logged in */}
              {user && <NotificationBell />}

              {/* Tài khoản button - đã ẩn theo yêu cầu */}
              {/* <div className="relative group">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 cursor-pointer">
                  <User className="w-4 h-4 text-green-400 group-hover:text-green-300 transition-colors" />
                  <span className="hidden xl:inline text-sm font-medium text-white group-hover:text-green-300 transition-colors">
                    Tài khoản
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 rounded-xl transition-all duration-300"></div>
                </div>
              </div> */}
            </div>

            {/* Right side with cart and login */}
            <div className="flex items-center gap-2 lg:gap-4">
              <HeaderShoppingCart />
              <LoginButton />
            </div>
          </div>

          {/* Bottom glow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
        </header>
      </>
    </div>
  );
}
