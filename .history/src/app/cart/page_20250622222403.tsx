"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/cart/CartItem";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingLink } from "@/components/ui/LoadingLink";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, clearCart, refreshCart, isLoading } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Initialize selected items when cart changes
  useEffect(() => {
    const allItemIds = new Set(cart.items.map((item) => item.product_id));
    setSelectedItems(allItemIds);
  }, [cart.items]);

  useEffect(() => {
    // Simulate loading for cart data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allItemIds = new Set(cart.items.map((item) => item.product_id));
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  // Handle individual item selection
  const handleItemSelect = (productId: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedItems(newSelected);
  };

  // Calculate totals for selected items only
  const calculateSelectedTotals = () => {
    const selectedCartItems = cart.items.filter((item) =>
      selectedItems.has(item.product_id)
    );
    const total_items = selectedCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const total_price = selectedCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { total_items, total_price, selectedCartItems };
  };

  const { total_items: selectedTotalItems, total_price: selectedTotalPrice } =
    calculateSelectedTotals();
  const isAllSelected =
    selectedItems.size === cart.items.length && cart.items.length > 0;

  // Removed auto-refresh to prevent infinite loop
  // Users can manually refresh if needed

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      await clearCart();
    }
  };

  // Handle checkout with selected items
  const handleCheckout = () => {
    console.log("handleCheckout called");

    // Check if user is logged in first
    if (!user) {
      console.log("User not logged in, redirecting to login");
      alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
      router.push("/login?redirect=/cart");
      return;
    }

    const { selectedCartItems } = calculateSelectedTotals();
    console.log("Selected cart items for checkout:", selectedCartItems);

    if (selectedCartItems.length === 0) {
      console.log("No items selected");
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    try {
      // Store selected items in localStorage to pass to checkout
      console.log("Storing selected items in localStorage:", selectedCartItems);
      localStorage.setItem(
        "selectedCartItems",
        JSON.stringify(selectedCartItems)
      );

      // Verify localStorage save
      const saved = localStorage.getItem("selectedCartItems");
      console.log("Verification - saved items:", saved);

      // Use Next.js router for better navigation
      console.log("Navigating to checkout...");
      router.push("/checkout");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Có lỗi xảy ra khi chuyển đến trang thanh toán. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-12 h-6 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-gray-200 rounded mb-2 w-20"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Skeleton */}
            <div className="bg-gray-50 rounded-lg p-6 h-fit animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-6 w-32"></div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h1>
          <p className="text-gray-600 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
            tuyệt vời của chúng tôi!
          </p>
          <LoadingLink
            href="/products"
            loadingMessage="Đang chuyển đến cửa hàng..."
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Tiếp tục mua sắm
          </LoadingLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen seamless-background">
      {/* Hero Section */}
      <div className="pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
                🛒 Giỏ hàng của bạn
              </h1>
              <p className="text-white/90 text-lg font-medium drop-shadow-md">
                {cart.total_items > 0
                  ? `${selectedItems.size}/${cart.total_items} sản phẩm được chọn`
                  : "Hãy thêm sản phẩm yêu thích vào giỏ hàng"}
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {cart.items.length === 0 ? (
          /* Empty Cart with beautiful design */
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-blue-100">
            {/* Animated Empty State */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-16 h-16 text-blue-400" />
              </div>
              <div className="absolute -top-2 -right-8 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-bounce opacity-60"></div>
              <div className="absolute -bottom-2 -left-8 w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Giỏ hàng chưa có sản phẩm nào
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Khám phá hàng ngàn sản phẩm công nghệ tuyệt vời và tìm những món
              đồ ưng ý nhất!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 Khám phá ngay
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-lg"
              >
                🏠 Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-3">
              {/* Cart Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="sr-only peer"
                          id="select-all"
                        />
                        <label
                          htmlFor="select-all"
                          className={`relative w-6 h-6 cursor-pointer group transition-all duration-300 ease-out hover:scale-105`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg border-2 transition-all duration-300 ease-out shadow-sm flex items-center justify-center ${
                              isAllSelected
                                ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-500 shadow-emerald-200 shadow-lg"
                                : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300"
                            }`}
                          >
                            <svg
                              className={`w-4 h-4 text-white transition-transform duration-300 ease-out drop-shadow-sm ${
                                isAllSelected ? "scale-100" : "scale-0"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </label>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Chọn tất cả
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        📦 Sản phẩm trong giỏ hàng
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Chọn sản phẩm và tiến hành thanh toán
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={refreshCart}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Cập nhật
                    </button>
                    <button
                      onClick={handleClearCart}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      <Trash2 className="w-5 h-5" />
                      Xóa tất cả
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
                  >
                    <CartItem
                      item={item}
                      isSelected={selectedItems.has(item.product_id)}
                      onSelect={handleItemSelect}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8 border-2 border-blue-100">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    💰 Tóm tắt đơn hàng
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Chi tiết thanh toán của bạn
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Items Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                          Số lượng:
                        </span>
                        <span className="font-bold text-blue-600 whitespace-nowrap">
                          {selectedTotalItems}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                          Tạm tính:
                        </span>
                        <span className="font-semibold whitespace-nowrap">
                          {formatPrice(selectedTotalPrice)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                          Ship:
                        </span>
                        <span className="font-medium text-green-600 text-sm whitespace-nowrap">
                          Free
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                          Giảm giá:
                        </span>
                        <span className="font-medium text-green-600 text-sm whitespace-nowrap">
                          -0₫
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold whitespace-nowrap">
                        Tổng:
                      </span>
                      <span className="text-2xl font-bold whitespace-nowrap">
                        {formatPrice(selectedTotalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        console.log(
                          "🚀 Button clicked! selectedTotalItems:",
                          selectedTotalItems
                        );
                        console.log("🚀 Selected items:", selectedItems);
                        handleCheckout();
                      }}
                      disabled={selectedTotalItems === 0}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      🚀 Thanh toán ngay ({selectedTotalItems} sản phẩm)
                    </button>

                    <Link
                      href="/products"
                      className="w-full block text-center py-3 border-2 border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 font-medium"
                    >
                      🛍️ Tiếp tục mua sắm
                    </Link>
                  </div>

                  {/* Security Info */}
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">🔒 Giao dịch bảo mật</p>
                      <p className="text-xs mt-1">SSL + Hỗ trợ 24/7</p>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex justify-center items-center gap-4 pt-4">
                    <div className="text-2xl">💳</div>
                    <div className="text-2xl">🛡️</div>
                    <div className="text-2xl">⚡</div>
                    <div className="text-2xl">🎯</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
