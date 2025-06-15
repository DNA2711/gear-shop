"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>("");
  const [countdown, setCountdown] = useState(3);

  // Hàm xóa giỏ hàng
  const clearCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gear-shop-cart');
    }
  };

  useEffect(() => {
    const orderIdParam = params.orderId as string;
    setOrderId(orderIdParam);

    // Xóa giỏ hàng ngay khi vào trang thanh toán
    clearCart();

    // Start countdown immediately
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [params.orderId, router]);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Modal Header */}
        <div className="relative p-6 text-center">
          {/* Success Animation */}
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

          <h2 className="text-3xl font-bold text-green-600 mb-3">
            🎉 Thanh toán thành công!
          </h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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
                Tự động chuyển về trang chủ sau {countdown} giây
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Về trang chủ ngay →
            </button>
            
            <button
              onClick={() => router.push("/checkout/success")}
              className="w-full bg-gray-100 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Xem chi tiết đơn hàng
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Cảm ơn bạn đã mua hàng tại Gear Shop! 🛒
          </p>
        </div>
      </div>
    </div>
  );
}
