"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export function SalesChart() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<"sales" | "orders">(
    "sales"
  );

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSalesData(data.salesChart || []);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const maxSales =
    salesData.length > 0 ? Math.max(...salesData.map((d) => d.sales)) : 0;
  const maxOrders =
    salesData.length > 0 ? Math.max(...salesData.map((d) => d.orders)) : 0;
  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);

  const getBarHeight = (value: number, max: number) => {
    if (max === 0) return 20;
    return Math.max((value / max) * 240, 8);
  };

  const getGradientColor = (
    value: number,
    max: number,
    type: "sales" | "orders"
  ) => {
    const intensity = value / max;
    if (type === "sales") {
      return intensity > 0.7
        ? "from-blue-500 to-blue-600"
        : intensity > 0.4
        ? "from-blue-400 to-blue-500"
        : "from-blue-300 to-blue-400";
    } else {
      return intensity > 0.7
        ? "from-emerald-500 to-emerald-600"
        : intensity > 0.4
        ? "from-emerald-400 to-emerald-500"
        : "from-emerald-300 to-emerald-400";
    }
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

        <div className="space-y-6">
          <div className="flex items-end justify-between h-64 space-x-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-3 animate-pulse"
              >
                <div
                  className="w-12 bg-gray-200 rounded-t"
                  style={{ height: `${Math.random() * 200 + 40}px` }}
                ></div>
                <div className="w-8 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50"></div>
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-50 to-pink-50"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Biểu đồ doanh thu
              </h3>
              <p className="text-sm text-gray-600">
                Theo dõi hiệu suất kinh doanh 12 tháng gần nhất
              </p>
            </div>
          </div>

          {/* Metric Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setSelectedMetric("sales")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMetric === "sales"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Doanh thu</span>
            </button>
            <button
              onClick={() => setSelectedMetric("orders")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMetric === "orders"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Đơn hàng</span>
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-6">
          {salesData.length > 0 ? (
            <>
              <div className="flex items-end justify-between h-64 space-x-3 px-2">
                {salesData.map((data, index) => {
                  const value =
                    selectedMetric === "sales" ? data.sales : data.orders;
                  const max = selectedMetric === "sales" ? maxSales : maxOrders;
                  const height = getBarHeight(value, max);
                  const gradientColor = getGradientColor(
                    value,
                    max,
                    selectedMetric
                  );

                  return (
                    <div
                      key={data.month}
                      className="group flex flex-col items-center space-y-3 cursor-pointer"
                    >
                      <div className="relative">
                        <div
                          className={`w-12 bg-gradient-to-t ${gradientColor} rounded-t-lg shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105`}
                          style={{ height: `${height}px` }}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg"></div>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                            <div className="font-medium">{data.month}</div>
                            <div>
                              {selectedMetric === "sales"
                                ? `${data.sales} triệu VNĐ`
                                : `${data.orders} đơn hàng`}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded ${
                        selectedMetric === "sales"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedMetric === "sales"
                        ? "Doanh thu (triệu VNĐ)"
                        : "Số đơn hàng"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>Xu hướng tăng trưởng</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Tổng cộng</div>
                  <div className="text-lg font-bold text-gray-900">
                    {selectedMetric === "sales"
                      ? `${totalSales.toLocaleString()} triệu VNĐ`
                      : `${totalOrders.toLocaleString()} đơn hàng`}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
              <div className="text-lg font-medium">
                Không có dữ liệu doanh số
              </div>
              <div className="text-sm">
                Dữ liệu sẽ hiển thị khi có giao dịch
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
