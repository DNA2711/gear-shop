"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg
            className="w-14 h-14 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-green-600 mb-3">
          🎉 Thanh toán thành công!
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-semibold mb-1">
            Giao dịch hoàn tất
          </p>
          <p className="text-green-700 text-sm">
            Mã đơn hàng:{" "}
            <span className="font-mono font-bold">#{orderId}</span>
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-blue-700 text-sm font-medium">
              Tự động chuyển về trang chủ sau {countdown} giây
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Về trang chủ ngay →
          </button>

          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Xem đơn hàng của tôi
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Cảm ơn bạn đã mua hàng tại Gear Shop! 🛒
        </p>
      </div>
    </div>
  );
} 