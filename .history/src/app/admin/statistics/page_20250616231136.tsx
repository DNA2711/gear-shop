"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface SalesData {
  date: string;
  total: number;
  count?: number;
}

interface ProductStats {
  product_id: number;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

interface CategoryStats {
  name: string;
  order_count: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `/api/admin/statistics?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();

      // Ensure all data is arrays or has default values
      setSalesData(Array.isArray(data.salesData) ? data.salesData : []);
      setTopProducts(Array.isArray(data.topProducts) ? data.topProducts : []);
      setCategoryStats(
        Array.isArray(data.categoryDistribution)
          ? data.categoryDistribution
          : []
      );
      setTotalRevenue(data.totalRevenue || 0);
      setTotalOrders(data.totalOrders || 0);
      setAverageOrderValue(data.avgOrderValue || 0);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Set default values on error
      setSalesData([]);
      setTopProducts([]);
      setCategoryStats([]);
      setTotalRevenue(0);
      setTotalOrders(0);
      setAverageOrderValue(0);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  // Ensure arrays are safe for rendering
  const safeSalesData = Array.isArray(salesData) ? salesData : [];
  const safeTopProducts = Array.isArray(topProducts) ? topProducts : [];
  const safeCategoryStats = Array.isArray(categoryStats) ? categoryStats : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Thống kê bán hàng
          </h1>
          <div className="mt-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Tổng doanh thu
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Tổng đơn hàng</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {totalOrders}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">
              Giá trị đơn hàng trung bình
            </h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {formatCurrency(averageOrderValue)}
            </p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Doanh thu theo thời gian
          </h2>
          <div className="h-96">
            {safeSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safeSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      format(new Date(date), "dd/MM", { locale: vi })
                    }
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).replace("₫", "")
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(date) =>
                      format(new Date(date), "dd/MM/yyyy", { locale: vi })
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Doanh thu"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Không có dữ liệu
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sản phẩm bán chạy
            </h2>
            <div className="h-96">
              {safeTopProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={safeTopProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total_sold"
                      name="Số lượng bán"
                      fill="#3B82F6"
                    />
                    <Bar
                      dataKey="total_revenue"
                      name="Doanh thu"
                      fill="#10B981"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Phân bố đơn hàng theo danh mục
            </h2>
            <div className="h-96">
              {safeCategoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={safeCategoryStats}
                      dataKey="order_count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={({
                        name,
                        order_count,
                      }: {
                        name: string;
                        order_count: number;
                      }) => `${name} (${order_count})`}
                    >
                      {safeCategoryStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
