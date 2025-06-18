"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, Package, Calendar, CreditCard, Truck } from "lucide-react";
import { LoadingLink } from "@/components/ui/LoadingLink";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
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
        icon: CreditCard,
      },
      paid: {
        text: "Đã thanh toán",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: Package,
      },
      processing: {
        text: "Đang xử lý",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Package,
      },
      shipped: {
        text: "Đang giao hàng",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Truck,
      },
      delivered: {
        text: "Đã giao hàng",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: Package,
      },
      cancelled: {
        text: "Đã hủy",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: Package,
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Filter out pending orders from all orders
  const validOrders = orders.filter((order) => order.status !== "pending");

  const filteredOrders = validOrders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  const pendingOrders: Order[] = []; // No pending orders to show

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 rounded animate-pulse flex-1"
              ></div>
            ))}
          </div>

          {/* Orders Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>

                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đơn hàng của bạn
          </h1>
          <p className="text-gray-600">
            Theo dõi trạng thái và lịch sử đơn hàng của bạn
          </p>
        </div>

        {/* Pending Orders Alert */}
        {pendingOrders.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Bạn có {pendingOrders.length} đơn hàng đang chờ thanh toán
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Vui lòng hoàn tất thanh toán để chúng tôi có thể xử lý đơn
                  hàng của bạn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "all", label: "Tất cả", count: validOrders.length },
            {
              key: "paid",
              label: "Đã thanh toán",
              count: validOrders.filter((o) => o.status === "paid").length,
            },
            {
              key: "processing",
              label: "Đang xử lý",
              count: validOrders.filter((o) => o.status === "processing")
                .length,
            },
            {
              key: "shipped",
              label: "Đang giao hàng",
              count: validOrders.filter((o) => o.status === "shipped").length,
            },
            {
              key: "delivered",
              label: "Đã giao hàng",
              count: validOrders.filter((o) => o.status === "delivered").length,
            },
            {
              key: "cancelled",
              label: "Đã hủy",
              count: validOrders.filter((o) => o.status === "cancelled").length,
            },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === filter.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === "all"
                ? "Chưa có đơn hàng nào"
                : "Không tìm thấy đơn hàng"}
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === "all"
                ? "Bạn chưa đặt đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!"
                : "Không có đơn hàng nào với trạng thái này."}
            </p>
            {statusFilter === "all" && (
              <LoadingLink
                href="/products"
                loadingMessage="Đang chuyển đến cửa hàng..."
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mua sắm ngay
              </LoadingLink>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusDisplay(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className="w-6 h-6 text-gray-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {order.created_at ? format(
                            new Date(order.created_at),
                            "dd/MM/yyyy 'lúc' HH:mm",
                            { locale: vi }
                          ) : 'Chưa có ngày'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">
                              {item.product_name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <strong>Địa chỉ giao hàng:</strong>{" "}
                      {order.shipping_address}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} sản phẩm
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
