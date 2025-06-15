"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface VNPayQRCodeProps {
  orderId: string;
  amount: number;
}

const VNPayQRCode: React.FC<VNPayQRCodeProps> = ({ orderId, amount }) => {
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

  // Check payment status (simulate)
  const checkPaymentStatus = () => {
    // In a real app, you would check with your payment provider
    // For demo purposes, we'll simulate random success after some time
    const shouldSucceed = Math.random() > 0.7; // 30% chance of success

    if (shouldSucceed) {
      setPaymentStatus("success");
    }
  };

  useEffect(() => {
    fetchNgrokUrl();
  }, []);

  useEffect(() => {
    if (paymentStatus === "pending" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);

        // Check payment status every 10 seconds
        if (timeLeft % 10 === 0) {
          checkPaymentStatus();
        }
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
          Thanh toán thành công!
        </h3>
        <p className="text-gray-600 text-center">
          Đơn hàng #{orderId} đã được thanh toán thành công
        </p>
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

  // Generate professional payment URL
  const paymentUrl = `${ngrokUrl}/vnpay/checkout?order=${orderId}&amount=${amount}&ref=qr&channel=mobile`;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold">VNPay QR Payment</h3>
        </div>
        <p className="text-blue-100 text-sm">Quét mã QR để thanh toán an toàn</p>
      </div>

      <div className="p-8">
        {/* QR Code Container */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-100">
            <QRCodeSVG
              value={paymentUrl}
              size={220}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              📱 Sử dụng camera điện thoại để quét
            </p>
            <p className="text-xs text-gray-500">
              Hoặc mở ứng dụng ngân hàng có chức năng quét QR
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-600 font-medium mb-1">Mã đơn hàng</p>
              <p className="text-lg font-bold text-blue-900 font-mono bg-white px-3 py-2 rounded border">
                {orderId}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-blue-600 font-medium mb-1">Số tiền thanh toán</p>
              <p className="text-2xl font-bold text-blue-900 bg-white px-3 py-2 rounded border">
                {amount.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-700 font-semibold text-sm">
              Đang chờ thanh toán
            </span>
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full border border-red-200">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-600 font-semibold text-sm">
              Thời gian: <span className="font-mono">{formatTime(timeLeft)}</span>
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hướng dẫn thanh toán
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Mở ứng dụng ngân hàng hoặc camera điện thoại</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Quét mã QR code phía trên</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Xác nhận thanh toán trên trang web</span>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="flex items-center justify-center space-x-6 mb-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">SSL 256-bit</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Bảo mật PCI DSS</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Xác thực 3D Secure</span>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-800 text-sm underline flex items-center justify-center space-x-1 mx-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Làm mới mã QR</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            🔒 Được bảo vệ bởi VNPay Gateway • Ngân hàng Nhà nước Việt Nam
          </p>
        </div>
      </div>
    </div>
  );
};

export default VNPayQRCode;
