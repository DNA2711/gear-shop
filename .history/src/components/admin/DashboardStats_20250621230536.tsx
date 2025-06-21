"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
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
      change: `${stats.totalRevenue.change >= 0 ? "+" : ""}${
        stats.totalRevenue.change
      }%`,
      changeType: stats.totalRevenue.changeType,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      name: "Đơn hàng",
      value: formatNumber(stats.totalOrders.value),
      change: `${stats.totalOrders.change >= 0 ? "+" : ""}${
        stats.totalOrders.change
      }%`,
      changeType: stats.totalOrders.changeType,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      name: "Sản phẩm",
      value: formatNumber(stats.totalProducts.value),
      change:
        stats.totalProducts.change === 0
          ? "Không đổi"
          : `${stats.totalProducts.change >= 0 ? "+" : ""}${
              stats.totalProducts.change
            }%`,
      changeType: stats.totalProducts.changeType,
      icon: Package,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      name: "Khách hàng",
      value: formatNumber(stats.totalUsers.value),
      change:
        stats.totalUsers.change === 0
          ? "Không đổi"
          : `${stats.totalUsers.change >= 0 ? "+" : ""}${
              stats.totalUsers.change
            }%`,
      changeType: stats.totalUsers.changeType,
      icon: Users,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg border border-gray-100 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
          <div className="text-lg font-medium">
            Không thể tải dữ liệu thống kê
          </div>
          <div className="text-sm mt-2">Vui lòng thử lại sau</div>
        </div>
      </div>
    );
  }

  const statConfigs = getStatConfig(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statConfigs.map((stat, index) => (
        <div
          key={stat.name}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background decoration */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-white/5"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`rounded-xl ${stat.iconBg} p-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.changeType === "increase"
                    ? "text-emerald-600"
                    : stat.changeType === "decrease"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {stat.changeType === "increase" ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : stat.changeType === "decrease" ? (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                ) : null}
                {stat.change}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {stat.name}
              </h3>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                {stat.value}
              </p>
            </div>

            <div className="mt-4 flex items-center text-xs text-gray-500">
              <div
                className={`flex items-center ${
                  stat.changeType === "increase"
                    ? "text-emerald-600"
                    : stat.changeType === "decrease"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {stat.changeType === "increase" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : stat.changeType === "decrease" ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : null}
                <span className="font-medium">
                  {stat.changeType === "neutral"
                    ? "Ổn định"
                    : "So với tháng trước"}
                </span>
              </div>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
}
