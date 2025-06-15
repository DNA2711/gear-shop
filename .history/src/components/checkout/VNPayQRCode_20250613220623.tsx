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
  const [ngrokUrl, setNgrokUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const getLocalIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setLocalIp(data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
        // Fallback to localhost if can't get IP
        setLocalIp("localhost");
      }
    };
    getLocalIp();
  }, []);

  // Lấy URL ngrok
  useEffect(() => {
    const fetchNgrokUrl = async () => {
      try {
        const response = await fetch("/api/get-ngrok-url");
        if (!response.ok) {
          throw new Error("Failed to get ngrok URL");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setNgrokUrl(data.url);
      } catch (err) {
        console.error("Error fetching ngrok URL:", err);
        setError(
          err instanceof Error ? err.message : "Failed to get payment URL"
        );
      }
    };
    fetchNgrokUrl();
  }, []);

  // Countdown timer
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
    setError(null);
    // Refresh ngrok URL
    fetch("/api/get-ngrok-url")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setNgrokUrl(data.url);
      })
      .catch((err) => {
        console.error("Error refreshing ngrok URL:", err);
        setError(
          err instanceof Error ? err.message : "Failed to refresh payment URL"
        );
      });
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

  if (!ngrokUrl) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang tạo mã thanh toán...</p>
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
