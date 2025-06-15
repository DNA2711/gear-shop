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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tiếp tục mua sắm
          </Link>

          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>

            {cart.total_items > 0 && (
              <span className="text-gray-500">
                ({cart.total_items} sản phẩm)
              </span>
            )}
          </div>
        </div>

        {cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="text-gray-500 mb-8">
              Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ
              hàng
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Clear Cart Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Sản phẩm trong giỏ hàng
                </h2>

                <button
                  onClick={handleClearCart}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa tất cả
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-white rounded-lg shadow-sm"
                  >
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
