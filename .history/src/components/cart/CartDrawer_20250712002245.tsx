"use client";

import React from "react";
import { X, ShoppingBag } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-xl z-50">
        <div className="bg-blue-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-semibold">Giỏ hàng</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 hover:bg-blue-700 rounded transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Giỏ hàng đang trống
              </h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                Thêm sản phẩm để bắt đầu mua sắm
              </p>
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
