'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Download, Calendar } from 'lucide-react'

const revenueData = [
  { month: 'T1', revenue: 2400, orders: 145 },
  { month: 'T2', revenue: 1800, orders: 98 },
  { month: 'T3', revenue: 3200, orders: 187 },
  { month: 'T4', revenue: 2800, orders: 156 },
  { month: 'T5', revenue: 3600, orders: 201 },
  { month: 'T6', revenue: 4200, orders: 234 },
  { month: 'T7', revenue: 3800, orders: 198 },
  { month: 'T8', revenue: 4800, orders: 267 },
  { month: 'T9', revenue: 4200, orders: 223 },
  { month: 'T10', revenue: 5200, orders: 289 },
  { month: 'T11', revenue: 4600, orders: 245 },
  { month: 'T12', revenue: 5800, orders: 312 }
]

const categoryData = [
  { name: 'Điện thoại', value: 45, color: 'bg-blue-500' },
  { name: 'Laptop', value: 30, color: 'bg-green-500' },
  { name: 'Tablet', value: 15, color: 'bg-yellow-500' },
  { name: 'Phụ kiện', value: 10, color: 'bg-purple-500' }
]

const topProducts = [
  { name: 'iPhone 15 Pro Max', sales: 156, revenue: 4680000000 },
  { name: 'MacBook Air M2', sales: 89, revenue: 2491000000 },
  { name: 'Samsung Galaxy S24', sales: 134, revenue: 3886000000 },
  { name: 'iPad Pro 11"', sales: 67, revenue: 1339000000 },
  { name: 'AirPods Pro', sales: 234, revenue: 1403000000 }
]

const kpis = [
  {
    title: 'Doanh thu tháng này',
    value: '5.8 tỷ',
    change: '+18.2%',
    changeType: 'increase',
    icon: TrendingUp
  },
  {
    title: 'Đơn hàng tháng này',
    value: '312',
    change: '+12.5%',
    changeType: 'increase',
    icon: BarChart3
  },
  {
    title: 'Khách hàng mới',
    value: '89',
    change: '-5.2%',
    changeType: 'decrease',
    icon: TrendingDown
  },
  {
    title: 'Tỷ lệ chuyển đổi',
    value: '3.2%',
    change: '+0.8%',
    changeType: 'increase',
    icon: PieChart
  }
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('12months')
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Báo cáo thống kê</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="12months">12 tháng qua</option>
            <option value="custom">Tùy chọn</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 bg-blue-100 rounded-lg">
                <kpi.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between h-64 space-x-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-8 bg-blue-500 rounded-t relative group cursor-pointer"
                    style={{ 
                      height: `${(data.revenue / maxRevenue) * 200}px`,
                      minHeight: '20px'
                    }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {formatPrice(data.revenue * 1000000)}<br/>
                      {data.orders} đơn hàng
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Doanh thu (triệu VNĐ)</span>
                </div>
              </div>
              <div className="text-gray-500">
                Tổng: {formatPrice(revenueData.reduce((sum, d) => sum + d.revenue, 0) * 1000000)}
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Phân bố theo danh mục</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${category.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8">{category.value}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">582</div>
              <div className="text-sm text-gray-500">Tổng sản phẩm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hiệu suất
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-xs font-medium text-gray-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sales} sản phẩm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatPrice(product.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${(product.sales / Math.max(...topProducts.map(p => p.sales))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.round((product.sales / Math.max(...topProducts.map(p => p.sales))) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">85.2%</div>
          <div className="text-sm text-gray-500 mt-2">Tỷ lệ hài lòng khách hàng</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">4.8/5</div>
          <div className="text-sm text-gray-500 mt-2">Đánh giá trung bình</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">2.3 ngày</div>
          <div className="text-sm text-gray-500 mt-2">Thời gian giao hàng trung bình</div>
        </div>
      </div>
    </div>
  )
} 