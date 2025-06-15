"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>("");
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const orderIdParam = params.orderId as string;
    setOrderId(orderIdParam);

    // Countdown timer for redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/checkout/success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [params.orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success checkmark animation */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
    // Fast payment processing
    const processPayment = async () => {
      try {
        // Quick processing - just 0.5 seconds
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mark payment as successful
        setStatus("success");

        // Quick redirect after 1 second
        setTimeout(() => {
          router.push("/checkout/success");
        }, 1000);
      } catch (error) {
        console.error("Payment error:", error);
        setStatus("error");
      }
    };

    processPayment();
  }, [params.orderId, router]);

  if (status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đang xử lý thanh toán
          </h1>
          <p className="text-gray-600 mb-4">
            Mã đơn hàng: <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-sm text-gray-500">Đang kiểm tra giao dịch...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            ✅ Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-4">
            Mã đơn hàng: <span className="font-semibold">{orderId}</span>
          </p>
          <p className="text-sm text-green-600 mb-4 font-semibold">
            Giao dịch đã được xác nhận
          </p>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-sm text-gray-500">Chuyển hướng sau</span>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          Thanh toán thất bại
        </h1>
        <p className="text-gray-600 mb-4">
          Mã đơn hàng: <span className="font-semibold">{orderId}</span>
        </p>
        <button
          onClick={() => router.push("/checkout")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
