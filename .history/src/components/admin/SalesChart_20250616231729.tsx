"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export function SalesChart() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

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
  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Doanh số bán hàng
          </h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between h-64 space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-2 animate-pulse"
              >
                <div className="w-8 bg-gray-200 rounded-t h-20"></div>
                <div className="w-8 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Doanh số bán hàng
        </h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {salesData.length > 0 ? (
          <>
            <div className="flex items-end justify-between h-64 space-x-2">
              {salesData.map((data) => (
                <div
                  key={data.month}
                  className="flex flex-col items-center space-y-2"
                >
                  <div
                    className="w-8 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                    style={{
                      height:
                        maxSales > 0
                          ? `${(data.sales / maxSales) * 200}px`
                          : "20px",
                      minHeight: "20px",
                    }}
                    title={`${data.month}: ${data.sales} triệu VNĐ (${data.orders} đơn hàng)`}
                  ></div>
                  <span className="text-xs text-gray-500 font-medium">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Doanh số (triệu VNĐ)</span>
                </div>
              </div>
              <div className="text-gray-500">
                Tổng: {totalSales.toLocaleString()} triệu VNĐ
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Không có dữ liệu doanh số
          </div>
        )}
      </div>
    </div>
  );
}
