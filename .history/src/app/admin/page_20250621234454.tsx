import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { SalesChart } from "@/components/admin/SalesChart";
import { Calendar, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Dashboard Analytics
                </h1>
                <p className="mt-2 text-blue-100 text-lg">
                  Tổng quan hiệu suất kinh doanh và xu hướng thị trường
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-white/20 p-3">
                  <Activity className="h-8 w-8" />
                </div>
                <div className="text-right">
                  <div className="flex items-center text-blue-100">
                    <Calendar className="mr-2 h-4 w-4" />
                    Cập nhật lần cuối
                  </div>
                  <div className="text-sm font-medium">
                    {new Date().toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-white/5"></div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Chỉ số hiệu suất chính
            </h2>
          </div>
          <DashboardStats />
        </div>

        {/* Charts and Orders Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Sales Chart - Takes 2 columns */}
          <div className="xl:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-2">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Phân tích doanh thu
              </h2>
            </div>
            <SalesChart />
          </div>

          {/* Recent Orders - Takes 1 column */}
          <div className="xl:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Hoạt động gần đây
              </h2>
            </div>
            <RecentOrders />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-sm font-medium">Thêm sản phẩm</div>
                <div className="text-xs text-blue-100">Quản lý kho hàng</div>
              </div>
            </button>

            <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:scale-105">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-sm font-medium">Xem đơn hàng</div>
                <div className="text-xs text-emerald-100">
                  Theo dõi bán hàng
                </div>
              </div>
            </button>

            <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:scale-105">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-sm font-medium">Thống kê chi tiết</div>
                <div className="text-xs text-purple-100">Phân tích dữ liệu</div>
              </div>
            </button>

            <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:scale-105">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-sm font-medium">Quản lý khách hàng</div>
                <div className="text-xs text-orange-100">
                  Hệ thống tài khoản
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
