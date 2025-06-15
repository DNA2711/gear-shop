"use client";

import React, { useEffect } from "react";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/cart/CartItem";
import Link from "next/link";

export default function CartPage() {
  const { cart, clearCart, refreshCart, isLoading } = useCart();

  useEffect(() => {
    // Refresh cart when page loads to validate stock
    refreshCart();
  }, [refreshCart]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🛒 Giỏ hàng của bạn</h1>
              <p className="text-blue-100 text-lg">
                {cart.total_items > 0
                  ? `${cart.total_items} sản phẩm đang chờ thanh toán`
                  : "Hãy thêm sản phẩm yêu thích vào giỏ hàng"}
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 -mt-6 relative z-10">
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
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

                <div className="space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Số lượng sản phẩm:</span>
                      <span>{cart.total_items}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(cart.total_price)}</span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Phí vận chuyển:</span>
                      <span>Miễn phí</span>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {formatPrice(cart.total_price)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full block text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Tiến hành thanh toán
                  </Link>

                  {/* Continue Shopping */}
                  <Link
                    href="/products"
                    className="w-full block text-center py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </Link>

                  {/* Security Info */}
                  <div className="text-xs text-gray-500 text-center mt-4">
                    <p>🔒 Giao dịch được bảo mật</p>
                    <p>Thông tin thanh toán của bạn được mã hóa</p>
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
