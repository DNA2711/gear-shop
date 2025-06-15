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
      setCountdown((prev) => {
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
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-3">
          🎉 Thanh toán thành công!
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-semibold mb-1">
            Giao dịch hoàn tất
          </p>
          <p className="text-green-700 text-sm">
            Mã đơn hàng: <span className="font-mono font-bold">{orderId}</span>
          </p>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-blue-700 text-sm font-medium">
              Chuyển hướng sau {countdown} giây
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/checkout/success")}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Tiếp tục ngay →
        </button>

        <p className="text-xs text-gray-500 mt-4">Cảm ơn bạn đã mua hàng! 🛒</p>
      </div>
    </div>
  );
}
