"use client";

import React from "react";
import { ShoppingBag, ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/cart/CartItem";
import Link from "next/link";

export default function CartPage() {
  const { cart, clearCart, refreshCart, isLoading } = useCart();

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
                  ? `${cart.total_items} sản phẩm đang chờ thanh toán`
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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      📦 Sản phẩm trong giỏ hàng
                    </h2>
                    <p className="text-gray-600">
                      Kiểm tra và chỉnh sửa đơn hàng của bạn
                    </p>
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
              <div className="space-y-6">
                {cart.items.map((item, index) => (
                  <div
                    key={item.product_id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2">
                      <span className="text-sm font-medium text-blue-700">
                        Sản phẩm #{index + 1}
                      </span>
                    </div>
                    <CartItem item={item} />
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
                        <span className="text-gray-700 font-medium text-sm">
                          Số lượng:
                        </span>
                        <span className="font-bold text-blue-600">
                          {cart.total_items}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm">
                          Tạm tính:
                        </span>
                        <span className="font-semibold">
                          {formatPrice(cart.total_price)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                          Ship:
                        </span>
                        <span className="font-medium text-green-600 text-sm whitespace-nowrap">
                          Miễn phí
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium text-sm">
                          Giảm giá:
                        </span>
                        <span className="font-medium text-green-600 text-sm">
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
                        {formatPrice(cart.total_price)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <Link
                      href="/checkout"
                      className="w-full block text-center py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      🚀 Thanh toán ngay
                    </Link>

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
