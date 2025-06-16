"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      pending: {
        text: "Chờ thanh toán",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      paid: {
        text: "Đã thanh toán",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      processing: {
        text: "Đang xử lý",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      shipped: {
        text: "Đang giao hàng",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      delivered: {
        text: "Đã giao hàng",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      cancelled: {
        text: "Đã hủy",
        color: "bg-red-100 text-red-800 border-red-200",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Đơn hàng của bạn</h1>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: "all", label: "Tất cả", count: orders.length },
              {
                key: "paid",
                label: "Đã thanh toán",
                count: orders.filter((o) => o.status === "paid").length,
              },
              {
                key: "processing",
                label: "Đang xử lý",
                count: orders.filter((o) => o.status === "processing").length,
              },
              {
                key: "shipped",
                label: "Đang giao hàng",
                count: orders.filter((o) => o.status === "shipped").length,
              },
              {
                key: "delivered",
                label: "Đã giao hàng",
                count: orders.filter((o) => o.status === "delivered").length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  statusFilter === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="h-24 w-24 text-gray-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <p className="text-gray-500 text-lg">
            {statusFilter === "all"
              ? "Bạn chưa có đơn hàng nào."
              : `Không có đơn hàng nào ở trạng thái này.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusDisplay(order.status);
            return (
              <div
                key={order.id}
                className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        Đơn hàng #{order.id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm border ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Ngày đặt:{" "}
                      {format(
                        new Date(order.created_at!),
                        "dd/MM/yyyy 'lúc' HH:mm",
                        {
                          locale: vi,
                        }
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {order.total_amount.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items?.length || 0} sản phẩm
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  <h4 className="font-medium mb-3">Chi tiết sản phẩm:</h4>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 bg-white rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.primary_image ? (
                            <img
                              src={
                                item.primary_image.startsWith("data:")
                                  ? item.primary_image
                                  : `data:image/jpeg;base64,${item.primary_image}`
                              }
                              alt={item.product_name || "Sản phẩm"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML =
                                    '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-xs">Lỗi ảnh</span></div>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <span className="text-xs">Không có ảnh</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {item.product_name ||
                              `Sản phẩm #${item.product_id}`}
                          </h5>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            {item.product_code && (
                              <>
                                <span>Mã: {item.product_code}</span>
                                {item.brand_name && <span>•</span>}
                              </>
                            )}
                            {item.brand_name && <span>{item.brand_name}</span>}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.quantity} x{" "}
                            {item.price.toLocaleString("vi-VN")}đ
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        Địa chỉ giao hàng:
                      </p>
                      <p className="text-gray-600">{order.shipping_address}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">
                        Số điện thoại:
                      </p>
                      <p className="text-gray-600">{order.phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
