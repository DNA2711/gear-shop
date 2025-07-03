"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Home, Package, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface OrderInfo {
  id: string;
  total: number;
  status: string;
  created_at: string;
  full_name: string;
  email: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const fromVnpay = searchParams.get("from") === "vnpay";
  const urlStatus = searchParams.get("status"); // từ mock VNPay checkout
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "checking" | "success" | "failed"
  >("checking");

  useEffect(() => {
    const fetchOrderInfo = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrderInfo(data);

          // Nếu đến từ VNPay và order chưa paid, bắt đầu polling
          if (fromVnpay && data.status !== "paid") {
            setPaymentStatus("checking");
            startPaymentPolling();
          } else if (data.status === "paid") {
            setPaymentStatus("success");
          } else if (fromVnpay) {
            setPaymentStatus("failed");
          }
        }
      } catch (error) {
        console.error("Error fetching order info:", error);
        if (fromVnpay) {
          setPaymentStatus("failed");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId, fromVnpay]);

  // Polling function để check payment status
  const startPaymentPolling = () => {
    console.log("Starting payment status polling for order:", orderId);

    const pollPaymentStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Payment polling result:", data.status);

          if (data.status === "paid") {
            setPaymentStatus("success");
            setOrderInfo(data);
            console.log("Payment confirmed! Stopping polling.");
            return true; // Stop polling
          }
        }
        return false; // Continue polling
      } catch (error) {
        console.error("Error polling payment status:", error);
        return false;
      }
    };

    // Poll every 3 seconds for up to 5 minutes
    let attempts = 0;
    const maxAttempts = 100; // 5 minutes

    const pollInterval = setInterval(async () => {
      attempts++;
      console.log(`Polling attempt ${attempts}/${maxAttempts}`);

      const shouldStop = await pollPaymentStatus();

      if (shouldStop || attempts >= maxAttempts) {
        clearInterval(pollInterval);
        if (attempts >= maxAttempts && paymentStatus === "checking") {
          console.log("Polling timeout - marking as failed");
          setPaymentStatus("failed");
        }
      }
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  };

  // Function để simulate payment trong development
  const simulatePayment = async (status: string) => {
    try {
      console.log("Simulating payment:", status, "for order:", orderId);

      const response = await fetch("/api/vnpay/simulate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Payment ${status} simulated successfully!`);
        console.log("Payment simulation result:", data);

        // Trigger a re-check immediately
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(`Failed to simulate payment: ${data.error}`);
      }
    } catch (error) {
      console.error("Error simulating payment:", error);
      toast.error("Error simulating payment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {fromVnpay ? "Đang xử lý thanh toán..." : "Đang tải thông tin..."}
          </p>
        </div>
      </div>
    );
  }

  // Show checking state when polling for payment in development
  if (fromVnpay && paymentStatus === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ⏳ Đang xác nhận thanh toán
            </h1>

            <p className="text-gray-600 mb-8">
              Chúng tôi đang xác nhận giao dịch VNPay của bạn. Vui lòng đợi
              trong giây lát...
            </p>

            {orderInfo && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold">#{orderInfo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-blue-600">
                      {orderInfo.total.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <div className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                      Đang xác nhận
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">
                💡 Thông tin quan trọng
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Giao dịch đang được xử lý bởi VNPay</li>
                <li>• Thời gian xác nhận thường từ 30 giây đến 2 phút</li>
                <li>• Vui lòng không tắt trang này</li>
                <li>• Bạn sẽ nhận được thông báo khi hoàn tất</li>
              </ul>
            </div>

            {/* Development Debug Buttons */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  🔧 Development Debug (Chỉ hiển thị trong dev)
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => simulatePayment("paid")}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Simulate Success
                  </button>
                  <button
                    onClick={() => simulatePayment("failed")}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Simulate Failed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show failed state when payment failed
  if (fromVnpay && paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
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

            <h1 className="text-3xl font-bold text-red-600 mb-4">
              ❌ Thanh toán không thành công
            </h1>

            <p className="text-gray-600 mb-8">
              Giao dịch VNPay của bạn không thể hoàn tất. Vui lòng thử lại hoặc
              chọn phương thức thanh toán khác.
            </p>

            <div className="space-y-4">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Thử lại thanh toán
              </Link>

              <Link
                href="/cart"
                className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Quay về giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Thanh toán thành công!
          </h1>

          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Đơn hàng
            của bạn đã được thanh toán thành công qua VNPay.
          </p>

          {orderInfo && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Thông tin đơn hàng
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold">#{orderInfo.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-semibold text-green-600">
                    {orderInfo.total.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đã thanh toán
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-semibold">{orderInfo.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{orderInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-semibold">
                    {new Date(orderInfo.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Bước tiếp theo
            </h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>
                • Chúng tôi sẽ gửi email xác nhận đơn hàng trong vài phút tới
              </li>
              <li>
                • Đơn hàng sẽ được chuẩn bị và giao trong 2-3 ngày làm việc
              </li>
              <li>
                • Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng
                của tôi"
              </li>
              <li>• Liên hệ hotline nếu có bất kỳ thắc mắc nào</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Package className="w-5 h-5 mr-2" />
              Xem đơn hàng của tôi
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Tiếp tục mua sắm
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
