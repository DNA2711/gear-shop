"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw } from "lucide-react";

interface VNPayQRCodeProps {
  amount: number;
  orderId: string;
  onPaymentSuccess: () => void;
}

export default function VNPayQRCode({ amount, orderId, onPaymentSuccess }: VNPayQRCodeProps) {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === "pending") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStatus]);

  // Mock payment status check
  useEffect(() => {
    if (paymentStatus === "pending") {
      const checkPaymentStatus = async () => {
        try {
          // TODO: Replace with actual VNPay payment status check
          // For demo, we'll randomly simulate a successful payment
          const randomSuccess = Math.random() < 0.1; // 10% chance of success
          if (randomSuccess) {
            setPaymentStatus("success");
            onPaymentSuccess();
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };

      const interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [paymentStatus, onPaymentSuccess]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleRefresh = () => {
    setTimeLeft(900);
    setPaymentStatus("pending");
  };

  // Generate QR code data
  const qrData = `VNPAY_${orderId}_${amount}`;

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm text-gray-600">
          Sử dụng ứng dụng VNPay để quét mã QR và thanh toán
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <QRCodeSVG
              value={qrData}
              size={200}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
          </div>
          {paymentStatus === "pending" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <div className="text-white text-center">
                <p className="font-semibold mb-2">Đang chờ thanh toán</p>
                <p className="text-sm">Còn lại: {formatTime(timeLeft)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Số tiền:</span>
          <span className="font-semibold text-blue-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(amount)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Mã đơn hàng:</span>
          <span className="font-medium">{orderId}</span>
        </div>

        {paymentStatus === "pending" && (
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới mã QR
          </button>
        )}

        {paymentStatus === "success" && (
          <div className="text-center text-green-600 font-medium">
            Thanh toán thành công!
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="text-center text-red-600 font-medium">
            Thanh toán thất bại. Vui lòng thử lại.
          </div>
        )}
      </div>
    </div>
  );
}
