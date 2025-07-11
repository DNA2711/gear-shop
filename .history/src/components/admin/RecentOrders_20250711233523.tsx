"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Eye,
  User,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface RecentOrder {
  id: string;
  customer: string;
  products: string;
  amount: number;
  status: string;
  date: string;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
      return {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: "✓",
        label: "Đã thanh toán",
      };
    case "pending":
      return {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: "⏳",
        label: "Đang xử lý",
      };
    case "shipped":
    case "delivered":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "🚚",
        label: "Đã giao",
      };
    case "cancelled":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "✕",
        label: "Đã hủy",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "•",
        label: status,
      };
  }
};

export function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data.recentOrders || []);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gray-200 p-2 sm:p-3 animate-pulse">
              <div className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border border-gray-100 rounded-lg sm:rounded-xl animate-pulse space-y-3 sm:space-y-0"
            >
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
      <div className="absolute -right-3 sm:-right-6 -top-3 sm:-top-6 h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-purple-50 to-pink-50"></div>
      <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 h-10 w-10 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50"></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Đơn hàng gần đây
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Theo dõi hoạt động mua bán mới nhất
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
            <span>Cập nhật realtime</span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);

              return (
                <div
                  key={order.id}
                  className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="rounded-lg bg-blue-100 p-2 flex-shrink-0">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base truncate">
                          {order.id}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {order.customer}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-y-0 sm:space-y-2">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full border px-2 sm:px-3 py-1 text-xs font-medium ${statusConfig.color} whitespace-nowrap`}
                      >
                        <span>{statusConfig.icon}</span>
                        <span className="hidden sm:inline">{statusConfig.label}</span>
                      </span>
                      
                      <div className="flex items-center space-x-2 sm:space-x-0 sm:flex-col sm:items-end">
                        <div className="flex items-center text-emerald-600 font-semibold text-sm sm:text-base">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{formatCurrency(order.amount)}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                          <span className="whitespace-nowrap">{order.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        <span className="font-medium">Sản phẩm:</span> {order.products}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <button className="group/btn inline-flex items-center space-x-1 rounded-lg bg-gray-100 px-2 sm:px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200">
                          <Eye className="h-3 w-3 group-hover/btn:text-blue-600 transition-colors" />
                          <span className="hidden sm:inline">Chi tiết</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300" />
              <div className="text-base sm:text-lg font-medium mb-2">
                Chưa có đơn hàng nào
              </div>
              <div className="text-xs sm:text-sm">
                Đơn hàng mới sẽ hiển thị tại đây
              </div>
            </div>
          )}
        </div>

        {recentOrders.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-600">
                Hiển thị {recentOrders.length} đơn hàng gần nhất
              </div>
              
              <button className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-xs sm:text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg">
                <Eye className="h-4 w-4" />
                <span>Xem tất cả đơn hàng</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
