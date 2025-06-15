"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

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

          const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
          
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
    <div className="bg-white rounded-xl p-6 border-2 border-blue-100">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quét mã QR để thanh toán
        </h3>
        <p className="text-sm text-gray-600">
          Sử dụng ứng dụng Stripe để quét mã QR và thanh toán
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          {qrData ? (
            <QRCodeSVG
              value={qrData}
              size={200}
              level="H"
              includeMargin={true}
              className="rounded-lg"
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Payment Status */}
        {paymentStatus === "pending" && (
          <div className="text-center">
            <p className="font-semibold text-gray-900 mb-1">
              Đang chờ thanh toán
            </p>
            <p className="text-sm text-gray-600">
              Còn lại: {formatTime(timeLeft)}
            </p>
          </div>
        )}
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
