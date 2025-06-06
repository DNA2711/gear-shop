'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Tag, 
  List,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Quản lý thương hiệu', href: '/admin/brands', icon: Tag },
  { name: 'Quản lý danh mục', href: '/admin/categories', icon: List },
  { name: 'Quản lý sản phẩm', href: '/admin/products', icon: Package },
  { name: 'Quản lý người dùng', href: '/admin/users', icon: Users },
  { name: 'Quản lý đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Báo cáo thống kê', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <h1 className="text-white text-xl font-bold">Gear Shop Admin</h1>
      </div>
      <nav className="mt-8">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-left text-base font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 