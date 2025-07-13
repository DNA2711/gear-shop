"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { LoadingLink } from "@/components/ui/LoadingLink";
import HeaderDropdownMenu from "./header-dropdown-menu";
import HeaderShoppingCart from "./header-shopping-cart";
import LoginButton from "./login-button";
import { CategoryWithChildren } from "@/types/category";
import { ProductWithDetails } from "@/types/product";
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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    ProductWithDetails[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

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
    if (isMobileSearchOpen) {
      setIsMobileSearchOpen(false);
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowSuggestions(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Ngăn dropdown nháy khi dùng mũi tên
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
      } else {
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && searchSuggestions[selectedIndex]) {
        handleSuggestionClick(searchSuggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setIsMobileSearchOpen(false);
      searchInputRef.current?.blur();
      mobileSearchInputRef.current?.blur();
    }
  };

  const fetchSearchSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetch(
        `/api/products?search=${encodeURIComponent(query)}&limit=8&is_active=true`
      );
      if (response.ok) {
        const result = await response.json();
        const suggestions = result.success ? result.data : [];
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Delay 1 giây trước khi gọi API
    timeoutRef.current = setTimeout(() => {
      fetchSearchSuggestions(value);
    }, 1000);
  };

  const handleSuggestionClick = (product: any) => {
    router.push(`/products/${product.product_id}`);
    setSearchTerm("");
    setShowSuggestions(false);
    setIsMobileSearchOpen(false);
  };

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

  const SearchSuggestionsDropdown = ({ isMobile = false }) => (
    <>
      {showSuggestions && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 bg-white/95 glass-effect rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 max-h-[500px] overflow-y-auto animate-in search-dropdown ${
            isMobile ? "mx-4" : ""
          }`}
        >
          {searchSuggestions.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full pulse-dot"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Gợi ý cho "{searchTerm}"
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                    {searchSuggestions.length} kết quả
                  </span>
                </div>
              </div>

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
                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mr-3 md:mr-4 flex-shrink-0 shadow-md">
                      {product.primary_image ? (
                        <img
                          src={product.primary_image}
                          alt={product.product_name}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                          <Search className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
                        </div>
                      )}
                      <div className="absolute -top-1 -left-1 w-4 h-4 md:w-5 md:h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                        {product.product_name}
                      </h3>

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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <span className="text-sm md:text-lg font-bold gradient-text">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                              notation: "compact",
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </span>
                          {product.original_price &&
                            product.original_price > product.price && (
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
            <div className="p-6 md:p-8 text-center">
              <div className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-4 border-2 md:border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-sm md:text-base text-gray-500">
                Đang tìm kiếm...
              </p>
            </div>
          ) : null}
        </div>
      )}
    </>
  );

  return (
    <div>
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 backdrop-blur-md border-b border-blue-500/20 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-2 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 relative">
            <div className="flex items-center gap-3 sm:gap-4">
              <LoadingLink
                href={"/"}
                loadingMessage="Đang chuyển về Trang chủ..."
                className="text-2xl sm:text-3xl lg:text-4xl font-bold select-none flex items-center group transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Atom className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400 animate-spin-slow group-hover:animate-spin" />
                  <span className="text-white font-light tracking-wider text-lg sm:text-xl lg:text-2xl">
                    Gear
                  </span>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg font-medium tracking-wide transform group-hover:scale-110 transition-transform text-sm sm:text-base">
                    Hub
                  </span>
                </div>
              </LoadingLink>

              <div className="hidden md:block">
                <HeaderDropdownMenu />
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-lg lg:max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  onFocus={() => searchTerm && searchSuggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowSuggestions(false);
                      setSelectedIndex(-1);
                    }, 200);
                  }}
                  className="w-full pl-10 pr-20 py-2.5 lg:py-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-full backdrop-blur-sm focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                />
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 lg:px-4 py-1 transition-colors duration-200 z-10 text-sm"
                >
                  {searchLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Tìm"
                  )}
                </Button>

                <SearchSuggestionsDropdown />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleMobileSearch}
                className="md:hidden p-2 text-white hover:text-blue-400 transition-colors rounded-lg hover:bg-white/10"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex lg:hidden items-center gap-2">
                <LoadingLink
                  href="/pc-builder"
                  loadingMessage="Đang mở PC Builder..."
                  className="p-2 text-white hover:text-purple-400 transition-colors rounded-lg hover:bg-white/10"
                >
                  <span className="text-lg">🖥️</span>
                </LoadingLink>
                {user && <NotificationBell />}
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <LoadingLink
                  href="/pc-builder"
                  loadingMessage="Đang mở PC Builder..."
                  className="relative group"
                >
                  <div className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105">
                    <span className="text-lg">🖥️</span>
                    <span className="hidden xl:inline text-sm font-medium text-white group-hover:text-purple-300 transition-colors">
                      PC Builder
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300"></div>
                  </div>
                </LoadingLink>

                {user && <NotificationBell />}
              </div>

              <HeaderShoppingCart />
              <LoginButton />

              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-white hover:text-blue-400 transition-colors rounded-lg hover:bg-white/10"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="md:hidden pb-4 border-t border-white/10">
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  onFocus={() => searchTerm && setShowSuggestions(true)}
                  onBlur={() => {
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

                <SearchSuggestionsDropdown isMobile={true} />
              </div>
            </div>
          )}

          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10 pb-4">
              <div className="py-4 space-y-3">
                <LoadingLink
                  href="/products"
                  loadingMessage="Đang tải sản phẩm..."
                  className="block px-4 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Sản phẩm
                </LoadingLink>
                <LoadingLink
                  href="/pc-builder"
                  loadingMessage="Đang mở PC Builder..."
                  className="block px-4 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  🖥️ PC Builder
                </LoadingLink>
                <LoadingLink
                  href={user ? "/cart" : "/login?redirect=/cart"}
                  loadingMessage={
                    user
                      ? "Đang tải giỏ hàng..."
                      : "Đang chuyển đến đăng nhập..."
                  }
                  className="block px-4 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Giỏ hàng
                </LoadingLink>
                <LoadingLink
                  href="/orders"
                  loadingMessage="Đang tải đơn hàng..."
                  className="block px-4 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={closeMenu}
                >
                  Đơn hàng
                </LoadingLink>
                {user && (
                  <LoadingLink
                    href="/notifications"
                    loadingMessage="Đang tải thông báo..."
                    className="block px-4 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={closeMenu}
                  >
                    🔔 Thông báo
                  </LoadingLink>
                )}

                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="px-4 text-sm text-gray-400 mb-2">
                    Danh mục phổ biến
                  </div>
                  {popularCategories.map((category) => (
                    <LoadingLink
                      key={category.href}
                      href={category.href}
                      loadingMessage={`Đang tải ${category.name}...`}
                      className="flex items-center px-4 py-2 text-white hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={closeMenu}
                    >
                      <span className={`mr-3 ${category.color}`}>
                        {category.icon}
                      </span>
                      {category.name}
                    </LoadingLink>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
      </header>
    </div>
  );
}
