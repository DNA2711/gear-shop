"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

interface StatData {
  value: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
}

interface DashboardStats {
  totalRevenue: StatData;
  totalOrders: StatData;
  totalProducts: StatData;
  totalUsers: StatData;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const getStatConfig = (stats: DashboardStats) => [
    {
      name: "Tổng doanh thu",
      value: formatCurrency(stats.totalRevenue.value),
      change: `${stats.totalRevenue.change >= 0 ? "+" : ""}${stats.totalRevenue.change}%`,
      changeType: stats.totalRevenue.changeType,
      icon: DollarSign,
    },
    {
      name: "Đơn hàng",
      value: formatNumber(stats.totalOrders.value),
      change: `${stats.totalOrders.change >= 0 ? "+" : ""}${stats.totalOrders.change}%`,
      changeType: stats.totalOrders.changeType,
      icon: ShoppingCart,
    },
    {
      name: "Sản phẩm",
      value: formatNumber(stats.totalProducts.value),
      change: stats.totalProducts.change === 0 ? "Không đổi" : `${stats.totalProducts.change >= 0 ? "+" : ""}${stats.totalProducts.change}%`,
      changeType: stats.totalProducts.changeType,
      icon: Package,
    },
    {
      name: "Người dùng",
      value: formatNumber(stats.totalUsers.value),
      change: stats.totalUsers.change === 0 ? "Không đổi" : `${stats.totalUsers.change >= 0 ? "+" : ""}${stats.totalUsers.change}%`,
      changeType: stats.totalUsers.changeType,
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-full text-center py-8 text-gray-500">
          Không thể tải dữ liệu thống kê
        </div>
      </div>
    );
  }

  const statConfigs = getStatConfig(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statConfigs.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {stat.name}
                </h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div
              className={`flex items-center text-sm ${
                stat.changeType === "increase"
                  ? "text-green-600"
                  : stat.changeType === "decrease"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {stat.changeType === "increase" ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : stat.changeType === "decrease" ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : null}
              {stat.change}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              so với tháng trước
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
