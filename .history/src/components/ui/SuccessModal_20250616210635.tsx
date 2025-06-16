"use client";

import React from "react";
import { CheckCircle, X, Package, ArrowRight } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onViewOrders?: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "🎉 Đặt hàng thành công!",
  message = "Đơn hàng của bạn đã được xử lý thành công.",
  onViewOrders,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              {/* Animated ring */}
              <div className="absolute inset-0 w-20 h-20 border-4 border-green-200 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 text-sm text-gray-700">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Đơn hàng đã được xác nhận</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Thanh toán thành công</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-700">
                  <ArrowRight className="w-4 h-4 text-purple-600" />
                  <span>Sẽ được xử lý trong 1-2 ngày</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {onViewOrders && (
                <button
                  onClick={onViewOrders}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  📋 Xem đơn hàng của tôi
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 