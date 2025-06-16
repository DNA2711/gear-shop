"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Order {
  id: number;
  total_amount: number;
  status: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // For public access, we'll fetch order without auth
      const response = await fetch(`/api/payment/${orderId}`);

      if (!response.ok) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError(error instanceof Error ? error.message : "Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;

    try {
      setPaying(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update order status to paid
      const response = await fetch(`/api/payment/${orderId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Thanh toán thất bại");
      }

      // Show success message
      alert("Thanh toán thành công! 🎉");

      // Just close the window/tab or show success message
      // The VNPayQRCode component will detect the status change automatically
    } catch (error) {
      console.error("Payment error:", error);
      setError(error instanceof Error ? error.message : "Lỗi thanh toán");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-gray-600">
            Đơn hàng #{orderId} không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  if (order.status === "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
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
            Đã thanh toán
          </h1>
          <p className="text-gray-600">
            Đơn hàng #{orderId} đã được thanh toán thành công
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán đơn hàng
          </h1>
          <p className="text-gray-600">Đơn hàng #{orderId}</p>
        </div>

        {/* Order Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Chi tiết đơn hàng
          </h2>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">Tổng cộng:</p>
              <p className="text-lg font-bold text-blue-600">
                {order.total_amount.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={paying}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white text-lg ${
            paying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          } transition-colors`}
        >
          {paying ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </div>
          ) : (
            "Thanh toán ngay"
          )}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Đây là trang thanh toán demo. Trong thực tế sẽ tích hợp với VNPay,
            MoMo, v.v.
          </p>
        </div>
      </div>
    </div>
  );
}
