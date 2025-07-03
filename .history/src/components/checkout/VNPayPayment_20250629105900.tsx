"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface VNPayPaymentProps {
  orderId: string;
  amount: number;
  orderInfo?: string;
  onPaymentSuccess?: () => void;
}

const VNPayPayment: React.FC<VNPayPaymentProps> = ({
  orderId,
  amount,
  orderInfo,
  onPaymentSuccess,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vnpay/create-payment-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
          orderInfo: orderInfo || `Thanh toán đơn hàng #${orderId}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo link thanh toán");
      }

      if (data.success && data.paymentUrl) {
        console.log("Redirecting to VNPay:", data.paymentUrl);
        // Redirect đến VNPay payment gateway
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (error) {
      console.error("Error creating payment URL:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/cart");
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      {/* VNPay Logo */}
      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-6">
        <span className="text-white font-bold text-lg">VNPay</span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        Thanh toán qua VNPay
      </h2>

      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-900 mb-1">
          Số tiền: {amount.toLocaleString("vi-VN")} VNĐ
        </p>
        <p className="text-sm text-gray-600">Mã đơn hàng: #{orderId}</p>
      </div>

      {error && (
        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm text-center">{error}</p>
        </div>
      )}

      <div className="w-full space-y-3">
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </div>
          ) : (
            "💳 Thanh toán ngay"
          )}
        </button>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Hủy thanh toán
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg w-full">
        <h3 className="font-semibold text-blue-900 mb-2 text-sm">
          Hướng dẫn thanh toán:
        </h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Nhấn "Thanh toán ngay" để chuyển đến VNPay</li>
          <li>• Chọn phương thức thanh toán (ATM, Visa/Master, QR...)</li>
          <li>• Hoàn tất thanh toán theo hướng dẫn</li>
          <li>• Hệ thống sẽ tự động xác nhận đơn hàng</li>
        </ul>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Được bảo mật bởi VNPay Payment Gateway
        </p>
      </div>
    </div>
  );
};

export default VNPayPayment; 