"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>("");
  const [countdown, setCountdown] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

      const clearCart = () => {
    if (typeof window !== "undefined") {    
      try {
        localStorage.removeItem("gear-shop-cart");
      } catch (error) {}
    }
  };

  
  const goToHome = () => {
    try {
      router.push("/");
    } catch (error) {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const resolvedParams = await params;
        const orderIdParam = resolvedParams.orderId as string;
        setOrderId(orderIdParam);

        const updateOrderStatus = async () => {
          try {
            const response = await fetch(
              `/api/orders/${orderIdParam}/payment-success`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const result = await response.json();
            } else {
              let errorData;
              let responseText = "";
              try {
                responseText = await response.text();
                errorData = responseText
                  ? JSON.parse(responseText)
                  : { error: "Empty response" };
              } catch (e) {
                errorData = {
                  error: "Unable to parse error response",
                  raw: responseText,
                };
              }
            }
          } catch (error) {}
        };

        await updateOrderStatus();
        clearCart();
      } catch (error) {}
    };

    initializePayment();
  }, [params]);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(loadingInterval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            // Use setTimeout to avoid setState during render
            setTimeout(() => {
              goToHome();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [isLoading]);

  const handleGoHome = () => {
    goToHome();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="relative p-6 text-center">
          {isLoading ? (
            // Loading state
            <div className="py-8">
              <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Đang xử lý thanh toán...
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                Vui lòng đợi trong giây lát...
              </p>
            </div>
          ) : (
            // Success state
            <>
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
                  Mã đơn hàng:{" "}
                  <span className="font-mono font-bold">{orderId}</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
