'use client'

import { BarChart3 } from 'lucide-react'

const salesData = [
  { month: 'Jan', sales: 45 },
  { month: 'Feb', sales: 62 },
  { month: 'Mar', sales: 38 },
  { month: 'Apr', sales: 71 },
  { month: 'May', sales: 55 },
  { month: 'Jun', sales: 83 },
  { month: 'Jul', sales: 97 },
  { month: 'Aug', sales: 68 },
  { month: 'Sep', sales: 74 },
  { month: 'Oct', sales: 92 },
  { month: 'Nov', sales: 87 },
  { month: 'Dec', sales: 105 },
]

export function SalesChart() {
  const maxSales = Math.max(...salesData.map(d => d.sales))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Doanh số bán hàng</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-end justify-between h-64 space-x-2">
          {salesData.map((data) => (
            <div key={data.month} className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 bg-blue-500 rounded-t"
                style={{ 
                  height: `${(data.sales / maxSales) * 200}px`,
                  minHeight: '20px'
                }}
              ></div>
              <span className="text-xs text-gray-500 font-medium">{data.month}</span>
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
            Tổng: {salesData.reduce((sum, d) => sum + d.sales, 0).toLocaleString()} triệu VNĐ
          </div>
        </div>
      </div>
    </div>
  )
} 