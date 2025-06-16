"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface VNPayQRCodeProps {
  orderId: string;
  amount: number;
  onPaymentSuccess?: () => void;
}

const VNPayQRCode: React.FC<VNPayQRCodeProps> = ({
  orderId,
  amount,
  onPaymentSuccess,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [ngrokUrl, setNgrokUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch ngrok URL
  const fetchNgrokUrl = async () => {
    try {
      setError("");
      setLoading(true);

      const response = await fetch("/api/get-ngrok-url");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("URL not found in response");
      }

      setNgrokUrl(data.url);
      console.log("Ngrok URL fetched:", data.url);
    } catch (error) {
      console.error("Error fetching ngrok URL:", error);
      setError(
        error instanceof Error ? error.message : "Failed to get ngrok URL"
      );
    } finally {
      setLoading(false);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle refresh
  const handleRefresh = () => {
    setPaymentStatus("pending");
    setTimeLeft(300);
    fetchNgrokUrl();
  };

  // Update order status in database
  const updateOrderStatus = async (status: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        console.log(`Order ${orderId} status updated to ${status}`);
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Check payment status (simulate)
  const checkPaymentStatus = () => {
    // In a real app, you would check with your payment provider
    // For now, we'll only succeed when manually triggered
    // Removed automatic random success
  };

  // Manual payment success for testing
  const handleTestPayment = () => {
    setPaymentStatus("success");
    // Update order status to 'paid' in database
    updateOrderStatus("paid");
    // Call onPaymentSuccess callback
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  useEffect(() => {
    fetchNgrokUrl();
  }, []);

  useEffect(() => {
    if (paymentStatus === "pending" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);

        // Removed automatic payment checking
        // In real app, you would check with payment gateway here
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setPaymentStatus("failed");
    }
  }, [timeLeft, paymentStatus]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Đang tạo mã QR...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-red-600 text-center mb-4">Lỗi: {error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!ngrokUrl) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <p className="text-gray-600 text-center mb-4">
          Không thể tạo URL thanh toán
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-600 mb-2">
          🎉 Thanh toán thành công!
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Đơn hàng #{orderId} đã được thanh toán thành công
        </p>
        <p className="text-sm text-gray-500 text-center mb-4">
          Đang chuyển hướng và xóa giỏ hàng...
        </p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (paymentStatus === "failed") {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Thanh toán thất bại
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Phiên thanh toán đã hết hạn hoặc có lỗi xảy ra
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tạo mã QR mới
        </button>
      </div>
    );
  }

  // Generate payment URL
  const paymentUrl = `${ngrokUrl}/payment/${orderId}`;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <QRCodeSVG
          value={paymentUrl}
          size={200}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          includeMargin={true}
        />
        <p className="text-sm text-gray-600 mt-4 text-center">
          Quét mã QR để thanh toán
        </p>
      </div>

      <div className="text-center mb-4">
        <p className="text-lg font-semibold text-gray-900">
          Số tiền: {amount.toLocaleString("vi-VN")} VNĐ
        </p>
        <p className="text-sm text-gray-600">Mã đơn hàng: {orderId}</p>
      </div>

      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="text-orange-600 font-semibold">
          Đang chờ thanh toán
        </span>
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Thời gian còn lại:{" "}
          <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
        </p>
        <button
          onClick={handleRefresh}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Làm mới
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800 text-center mb-2">
          🔍 Quét mã QR bằng camera điện thoại để truy cập trang thanh toán
        </p>
        <p className="text-xs text-gray-600 text-center">
          Hoặc mở link: <span className="font-mono text-blue-600">{paymentUrl}</span>
        </p>
      </div>

      {/* Demo: Manual payment success button */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800 text-center mb-2">
          🧪 <strong>Demo Mode:</strong> Để test thanh toán, bấm nút bên dưới
        </p>
        <button
          onClick={handleTestPayment}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          ✅ Giả lập thanh toán thành công
        </button>
      </div>
    </div>
  );
};

export default VNPayQRCode;
