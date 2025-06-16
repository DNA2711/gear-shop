"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  totalAmount: number;
  onSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  orderId,
  totalAmount,
  onSuccess,
}: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/orders/${orderId}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Payment failed");
      }

      setPaymentStatus('success');
      
      // Wait a moment then call success callback
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus('error');
      setErrorMessage('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  // Reset status when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentStatus('form');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={paymentStatus === 'processing' ? undefined : onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
          {/* Close button - hidden during processing */}
          {paymentStatus !== 'processing' && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}

          {/* Payment Form */}
          {paymentStatus === 'form' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                💳 Thanh toán đơn hàng
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-bold text-blue-600 text-lg">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    🔒 Thanh toán an toàn và bảo mật
                  </p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Thanh toán ngay
              </button>
            </div>
          )}

          {/* Processing */}
          {paymentStatus === 'processing' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Đang xử lý thanh toán...
              </h3>
              
              <p className="text-gray-600 mb-6">
                Vui lòng không tắt trình duyệt trong quá trình thanh toán
              </p>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⏳ Đang kết nối với ngân hàng...
                </p>
              </div>
            </div>
          )}

          {/* Success */}
          {paymentStatus === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                ✅ Thanh toán thành công!
              </h3>
              
              <p className="text-gray-600">
                Đơn hàng đã được thanh toán thành công
              </p>
            </div>
          )}

          {/* Error */}
          {paymentStatus === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                ❌ Thanh toán thất bại
              </h3>
              
              <p className="text-gray-600 mb-6">{errorMessage}</p>

              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Thử lại
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 