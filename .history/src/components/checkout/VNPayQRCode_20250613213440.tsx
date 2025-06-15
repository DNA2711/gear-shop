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

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === "pending") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStatus]);

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
    setTimeLeft(900);
    setPaymentStatus("pending");
    // Refresh payment intent
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        orderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => {
        console.error("Error refreshing payment intent:", error);
      });
  };

  // Generate QR code data with Stripe payment intent
  const qrData = clientSecret ? `stripe://payment/${clientSecret}` : "";

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Sử dụng ứng dụng ngân hàng của bạn để quét mã QR
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <QRCodeSVG value={qrData} size={200} level="H" includeMargin={true} />
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
        <p className="text-sm text-gray-500">Hoặc chuyển khoản trực tiếp:</p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Ngân hàng: Vietcombank</p>
          <p>Số tài khoản: 1234567890</p>
          <p>Chủ tài khoản: GEAR SHOP</p>
          <p>Nội dung: GEAR_SHOP_{orderId}</p>
        </div>
      </div>
    </div>
  );
}
