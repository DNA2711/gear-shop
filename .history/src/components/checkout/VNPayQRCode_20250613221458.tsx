"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw } from "lucide-react";

interface VNPayQRCodeProps {
  amount: number;
  orderId: string;
}

export default function VNPayQRCode({ amount, orderId }: VNPayQRCodeProps) {
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [ngrokUrl, setNgrokUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkNgrokStatus = async () => {
    try {
      const response = await fetch("/api/check-ngrok");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check ngrok status");
      }

      if (data.status === "connected") {
        setNgrokUrl(data.url);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error checking ngrok status:", err);
      return false;
    }
  };

  useEffect(() => {
    const initializeNgrok = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if ngrok is already connected
        const isConnected = await checkNgrokStatus();
        if (isConnected) {
          setIsLoading(false);
          return;
        }

        // If not connected, try to connect
        const response = await fetch("/api/get-ngrok-url");
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            // If connection is in progress, wait and try again
            setTimeout(initializeNgrok, 2000);
            return;
          }
          throw new Error(data.error || "Failed to get payment URL");
        }

        setNgrokUrl(data.url);
      } catch (err) {
        console.error("Error initializing ngrok:", err);
        setError(
          err instanceof Error ? err.message : "Failed to get payment URL"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeNgrok();
  }, []);

  useEffect(() => {
    if (paymentStatus === "pending" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStatus, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleRefresh = async () => {
    setPaymentStatus("pending");
    setTimeLeft(900);
    setError(null);
    setIsLoading(true);

    try {
      // First check if ngrok is already connected
      const isConnected = await checkNgrokStatus();
      if (isConnected) {
        setIsLoading(false);
        return;
      }

      // If not connected, try to connect
      const response = await fetch("/api/get-ngrok-url");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh payment URL");
      }

      setNgrokUrl(data.url);
    } catch (err) {
      console.error("Error refreshing ngrok URL:", err);
      setError(
        err instanceof Error ? err.message : "Failed to refresh payment URL"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang tạo mã thanh toán...</p>
      </div>
    );
  }

  if (!ngrokUrl) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 mb-4">Không thể tạo mã thanh toán</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const qrCodeData = `${ngrokUrl}/checkout/payment?orderId=${orderId}&amount=${amount}`;

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Sử dụng ứng dụng ngân hàng của bạn để quét mã QR này
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCodeSVG
          value={qrCodeData}
          size={200}
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Thời gian còn lại</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatTime(timeLeft)}
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Trạng thái thanh toán</p>
        <p className="text-lg font-semibold text-yellow-600">
          Đang chờ thanh toán
        </p>
      </div>

      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Làm mới
      </button>
    </div>
  );
}
