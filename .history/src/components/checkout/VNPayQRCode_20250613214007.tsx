"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface VNPayQRCodeProps {
  amount: number;
  orderId: string;
  onPaymentSuccess: () => void;
}

export default function VNPayQRCode({
  amount,
  orderId,
  onPaymentSuccess,
}: VNPayQRCodeProps) {
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [clientSecret, setClientSecret] = useState<string>("");
  const [localIp, setLocalIp] = useState<string>("");

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            orderId,
          }),
        });

        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, [amount, orderId]);

  // Lấy địa chỉ IP local
  useEffect(() => {
    if (paymentStatus === "pending" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus, timeLeft]);

  // Check payment status
  useEffect(() => {
    if (paymentStatus === "pending" && clientSecret) {
      const checkPaymentStatus = async () => {
        try {
          const stripe = await stripePromise;
          if (!stripe) return;

          const { paymentIntent } = await stripe.retrievePaymentIntent(
            clientSecret
          );

          if (paymentIntent?.status === "succeeded") {
            setPaymentStatus("success");
            onPaymentSuccess();
          } else if (paymentIntent?.status === "canceled") {
            setPaymentStatus("failed");
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };

      const interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [paymentStatus, clientSecret, onPaymentSuccess]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleRefresh = () => {
    setPaymentStatus("pending");
    setTimeLeft(900);
  };

  // Tạo URL thanh toán
  const paymentUrl = `${window.location.origin}/payment/${orderId}`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Sử dụng điện thoại của bạn để quét mã QR
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <QRCodeSVG
            value={paymentUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Thời gian còn lại:{" "}
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Số tiền:{" "}
            <span className="font-medium">
              {amount.toLocaleString("vi-VN")}đ
            </span>
          </p>
        </div>

        {paymentStatus === "pending" && (
          <div className="text-center">
            <p className="text-sm text-yellow-600">Đang chờ thanh toán...</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Làm mới
            </button>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="text-center">
            <p className="text-sm text-green-600">Thanh toán thành công!</p>
          </div>
        )}

        {paymentStatus === "failed" && (
          <div className="text-center">
            <p className="text-sm text-red-600">Thanh toán thất bại</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Hoặc nhấp vào liên kết bên dưới để thanh toán:
        </p>
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
        >
          {paymentUrl}
        </a>
      </div>
    </div>
  );
}
