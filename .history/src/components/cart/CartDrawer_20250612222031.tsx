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
      {/* Backdrop - z-index lower than header */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer - same z-index as header */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold">Giỏ hàng</h2>
                <p className="text-sm text-blue-100">
                  {cart.total_items} sản phẩm
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-500 mb-6">
                Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.product_id} className="bg-gray-50 rounded-lg">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 p-4 flex-shrink-0">
              {/* Clear Cart Button */}
              {cart.items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 disabled:opacity-50 text-sm mb-4"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa toàn bộ giỏ hàng
                </button>
              )}

              {/* Summary */}
              <div className="bg-white rounded-lg p-4 mb-4 border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tổng số lượng:</span>
                  <span className="font-medium">
                    {cart.total_items} sản phẩm
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Tổng tiền:</span>
                  <span className="text-blue-600">
                    {formatPrice(cart.total_price)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || cart.items.length === 0}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {isLoading ? "Đang xử lý..." : "Thanh toán"}
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
    </>
  );
}
