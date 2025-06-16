"use client";

import React from "react";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  onViewOrders: () => void;
}

export default function SuccessModal({
  isOpen,
  onClose,
  orderId,
  amount,
  onViewOrders,
}: SuccessModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thanh toán thành công!"
      showCloseButton={false}
    >
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-gray-900">
            🎉 Chúc mừng! Đơn hàng đã được đặt thành công
          </h4>
          <p className="text-gray-600">
            Cảm ơn bạn đã tin tưởng và mua sắm tại Gear Shop
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Mã đơn hàng:
            </span>
            <span className="font-semibold text-blue-600">#{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Tổng tiền:
            </span>
            <span className="font-bold text-green-600">
              {formatPrice(amount)}
            </span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h5 className="font-semibold text-blue-900 mb-2">
            📋 Bước tiếp theo:
          </h5>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Chúng tôi sẽ xử lý đơn hàng trong vòng 24h</li>
            <li>• Bạn sẽ nhận được email xác nhận</li>
            <li>• Đơn hàng sẽ được giao trong 2-3 ngày</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onViewOrders}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
          >
            📦 Xem đơn hàng của tôi
          </button>
          
          <button
            onClick={onClose}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
          >
            🛍️ Tiếp tục mua sắm
          </button>
        </div>

        {/* Thank You Message */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            💝 Cảm ơn bạn đã lựa chọn Gear Shop!
          </p>
        </div>
      </div>
    </Modal>
  );
} 