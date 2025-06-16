"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Eye, User, Calendar, DollarSign, TrendingUp } from "lucide-react";

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
        label: "Đã thanh toán"
      };
    case "pending":
      return {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: "⏳",
        label: "Đang xử lý"
      };
    case "shipped":
    case "delivered":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "🚚",
        label: "Đã giao"
      };
    case "cancelled":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "✕",
        label: "Đã hủy"
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "•",
        label: status
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
      <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gray-200 p-3 animate-pulse">
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 border border-gray-100 rounded-xl animate-pulse"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                  <div className="flex items-center justify-between">
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
    <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-50 to-pink-50"></div>
      <div className="absolute -bottom-3 -left-3 h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-3">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Đơn hàng gần đây
              </h3>
              <p className="text-sm text-gray-600">
                Theo dõi hoạt động mua bán mới nhất
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>Cập nhật realtime</span>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {recentOrders.length > 0 ? (
            recentOrders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              
              return (
                <div
                  key={order.id}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50/50 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {order.id}
                        </p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>
                    
                    <span
                      className={`inline-flex items-center space-x-1 rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.color}`}
                    >
                      <span>{statusConfig.icon}</span>
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="rounded bg-gray-100 p-1 mt-0.5">
                        <ShoppingCart className="h-3 w-3 text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 flex-1" title={order.products}>
                        {order.products}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="rounded bg-emerald-100 p-1">
                          <DollarSign className="h-3 w-3 text-emerald-600" />
                        </div>
                        <p className="font-bold text-emerald-600 text-lg">
                          {formatCurrency(order.amount)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{order.date}</span>
                        </div>
                        
                        <button className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 rounded-xl"></div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <div className="text-lg font-medium">Không có đơn hàng nào</div>
              <div className="text-sm">Đơn hàng mới sẽ hiển thị tại đây</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button 
            className="group flex items-center justify-center w-full space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white font-medium transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-lg"
            onClick={() => window.location.href = '/admin/orders'}
          >
            <span>Xem tất cả đơn hàng</span>
            <Eye className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
