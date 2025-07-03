"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Home, Package, Clock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"checking" | "success" | "failed">("checking");

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
        }
      } catch (error) {
        console.error("Error fetching order info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
