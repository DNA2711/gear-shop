"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { LoadingLink } from "@/components/ui/LoadingLink";
import HeaderDropdownMenu from "./header-dropdown-menu";
import HeaderShoppingCart from "./header-shopping-cart";
import LoginButton from "./login-button";
import { CategoryWithChildren } from "@/types/category";
import { useAuth } from "@/contexts/AuthContext";

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <LoadingLink
            href="/"
            loadingMessage="Đang về trang chủ..."
            className="flex items-center space-x-2 text-xl font-bold text-gray-900"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span>Gear Shop</span>
          </LoadingLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <LoadingLink
              href="/"
              loadingMessage="Đang về trang chủ..."
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </LoadingLink>

            <LoadingLink
              href="/products"
              loadingMessage="Đang tải sản phẩm..."
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sản phẩm
            </LoadingLink>

            <div className="relative">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>Danh mục</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {categories.slice(0, 8).map((category) => (
                    <LoadingLink
                      key={category.category_id}
                      href={`/products?category=${category.category_id}`}
                      loadingMessage={`Đang tải ${category.category_name}...`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      {category.category_name}
                    </LoadingLink>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <LoadingLink
                      href="/products"
                      loadingMessage="Đang tải tất cả sản phẩm..."
                      className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      Xem tất cả →
                    </LoadingLink>
                  </div>
                </div>
              )}
            </div>

            <LoadingLink
              href="/pc-builder"
              loadingMessage="Đang tải PC Builder..."
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              PC Builder
            </LoadingLink>

            {user && (
              <LoadingLink
                href="/orders"
                loadingMessage="Đang tải đơn hàng..."
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Đơn hàng
              </LoadingLink>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <HeaderShoppingCart />
            <LoginButton />

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <LoadingLink
                href="/"
                loadingMessage="Đang về trang chủ..."
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Trang chủ
              </LoadingLink>

              <LoadingLink
                href="/products"
                loadingMessage="Đang tải sản phẩm..."
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sản phẩm
              </LoadingLink>

              <LoadingLink
                href="/pc-builder"
                loadingMessage="Đang tải PC Builder..."
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                PC Builder
              </LoadingLink>

              {user && (
                <LoadingLink
                  href="/orders"
                  loadingMessage="Đang tải đơn hàng..."
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Đơn hàng
                </LoadingLink>
              )}

              {/* Mobile Categories */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Danh mục</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <LoadingLink
                      key={category.category_id}
                      href={`/products?category=${category.category_id}`}
                      loadingMessage={`Đang tải ${category.category_name}...`}
                      onClick={closeMenu}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {category.category_name}
                    </LoadingLink>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
