"use client";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

const stats = [
  {
    name: "Tổng doanh thu",
    value: "2.4 tỷ",
    change: "+12.5%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    name: "Đơn hàng",
    value: "1,247",
    change: "+8.2%",
    changeType: "increase",
    icon: ShoppingCart,
  },
  {
    name: "Sản phẩm",
    value: "582",
    change: "+15.3%",
    changeType: "increase",
    icon: Package,
  },
  {
    name: "Người dùng",
    value: "3,891",
    change: "-2.1%",
    changeType: "decrease",
    icon: Users,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
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
                  : "text-red-600"
              }`}
            >
              {stat.changeType === "increase" ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
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
