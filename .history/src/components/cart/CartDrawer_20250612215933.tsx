"use client";

import React from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, clearCart, isLoading } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    window.location.href = "/checkout";
  };

  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      await clearCart();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with gradient */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-gray-900/20 via-blue-900/30 to-black/40 backdrop-blur-md z-[60] transition-all duration-500"
        onClick={onClose}
      />

      {/* Drawer with modern design */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl z-[70] transform transition-all translate-x-0 duration-500 ease-out border-l-2 border-gradient-to-b from-blue-400 to-cyan-400">
        {/* Header with sci-fi theme */}
        <div className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-2 right-1/3 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse opacity-40"></div>
            <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
          </div>

          <div className="relative flex items-center justify-between p-6 border-b border-blue-400/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-cyan-400" />
                {cart.total_items > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-900">
                      {cart.total_items}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Gear Cart
                </h2>
                <p className="text-xs text-cyan-200">
                  {cart.total_items} sản phẩm trong giỏ
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="group p-2 hover:bg-white/10 rounded-full transition-all duration-200 border border-cyan-400/20 hover:border-cyan-400/50"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5 text-cyan-400 group-hover:text-white group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>
        </div>

        {/* Content with modern styling */}
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
          {cart.items.length === 0 ? (
            /* Empty Cart with sci-fi design */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                {/* Animated empty state */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-blue-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-bounce opacity-60"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-wide">
                  Cart của bạn đang trống
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Khám phá những sản phẩm công nghệ tuyệt vời của chúng tôi
                </p>
                
                <button
                  onClick={onClose}
                  className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium tracking-wide shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    🚀 Khám phá ngay
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.product_id} item={item} />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Clear Cart Button */}
                {cart.items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa toàn bộ giỏ hàng
                  </button>
                )}

                {/* Total Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tổng số lượng:</span>
                    <span>{cart.total_items} sản phẩm</span>
                  </div>

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng tiền:</span>
                    <span className="text-blue-600">
                      {formatPrice(cart.total_price)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || cart.items.length === 0}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Thanh toán
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
