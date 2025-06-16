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
  count: number;
}

interface ProductStats {
  product_id: number;
  product_name: string;
  total_sales: number;
  quantity_sold: number;
}

interface CategoryStats {
  category_id: number;
  category_name: string;
  total_sales: number;
  percentage: number;
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
      const response = await fetch(`/api/admin/statistics?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setSalesData(data.salesData);
      setTopProducts(data.topProducts);
      setCategoryStats(data.categoryStats);
      setTotalRevenue(data.totalRevenue);
      setTotalOrders(data.totalOrders);
      setAverageOrderValue(data.averageOrderValue);
    } catch (error) {
      console.error("Error fetching statistics:", error);
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
          <h1 className="text-2xl font-bold text-gray-900">Thống kê bán hàng</h1>
          <div className="mt-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Tổng doanh thu</h3>
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
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
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
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Số đơn hàng"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sản phẩm bán chạy
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product_name" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).replace("₫", "")
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar
                    dataKey="total_sales"
                    name="Doanh thu"
                    fill="#3B82F6"
                  />
                  <Bar
                    dataKey="quantity_sold"
                    name="Số lượng"
                    fill="#10B981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Phân bố doanh thu theo danh mục
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    dataKey="total_sales"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={({
                      category_name,
                      percentage,
                    }: {
                      category_name: string;
                      percentage: number;
                    }) =>
                      `${category_name} (${percentage.toFixed(1)}%)`
                    }
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 