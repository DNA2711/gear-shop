import { ShoppingCart, Eye } from 'lucide-react'

const recentOrders = [
  {
    id: '#12345',
    customer: 'Nguyễn Văn A',
    product: 'iPhone 15 Pro Max',
    amount: '29.990.000đ',
    status: 'Hoàn thành',
    date: '2024-01-15',
  },
  {
    id: '#12346',
    customer: 'Trần Thị B',
    product: 'MacBook Air M2',
    amount: '25.990.000đ',
    status: 'Đang xử lý',
    date: '2024-01-15',
  },
  {
    id: '#12347',
    customer: 'Lê Minh C',
    product: 'AirPods Pro',
    amount: '5.990.000đ',
    status: 'Đã giao',
    date: '2024-01-14',
  },
  {
    id: '#12348',
    customer: 'Phạm Thu D',
    product: 'iPad Pro 11"',
    amount: '19.990.000đ',
    status: 'Chờ thanh toán',
    date: '2024-01-14',
  },
  {
    id: '#12349',
    customer: 'Hoàng Văn E',
    product: 'Apple Watch Series 9',
    amount: '8.990.000đ',
    status: 'Hoàn thành',
    date: '2024-01-13',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hoàn thành':
      return 'bg-green-100 text-green-800'
    case 'Đang xử lý':
      return 'bg-yellow-100 text-yellow-800'
    case 'Đã giao':
      return 'bg-blue-100 text-blue-800'
    case 'Chờ thanh toán':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function RecentOrders() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
        <ShoppingCart className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-700">{order.product}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-semibold text-blue-600">{order.amount}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                </div>
              </div>
            </div>
            <button className="ml-4 p-2 text-gray-600 hover:text-blue-600">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả đơn hàng
        </button>
      </div>
    </div>
  )
} 