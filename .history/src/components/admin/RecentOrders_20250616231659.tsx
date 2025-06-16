"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";

interface RecentOrder {
  id: string;
  customer: string;
  products: string;
  amount: number;
  status: string;
  date: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
    case "delivered":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "Đã thanh toán";
    case "pending":
      return "Đang xử lý";
    case "shipped":
      return "Đã giao";
    case "delivered":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Đơn hàng gần đây
          </h3>
          <ShoppingCart className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-pulse"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="mt-2">
                  <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Đơn hàng gần đây
        </h3>
        <ShoppingCart className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700 truncate" title={order.products}>
                    {order.products}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-semibold text-blue-600">
                      {formatCurrency(order.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
              </div>
              <button className="ml-4 p-2 text-gray-600 hover:text-blue-600">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không có đơn hàng nào
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button 
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => window.location.href = '/admin/orders'}
        >
          Xem tất cả đơn hàng
        </button>
      </div>
    </div>
  );
}
