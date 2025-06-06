'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Search, ChevronRight, ChevronDown } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  parentId: number | null
  status: 'active' | 'inactive'
  productCount: number
  children?: Category[]
  isExpanded?: boolean
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Điện thoại & Máy tính bảng',
    slug: 'dien-thoai-may-tinh-bang',
    description: 'Các thiết bị di động thông minh',
    parentId: null,
    status: 'active',
    productCount: 120,
    isExpanded: true,
    children: [
      {
        id: 2,
        name: 'Điện thoại thông minh',
        slug: 'dien-thoai-thong-minh',
        description: 'Smartphone các loại',
        parentId: 1,
        status: 'active',
        productCount: 80
      },
      {
        id: 3,
        name: 'Máy tính bảng',
        slug: 'may-tinh-bang',
        description: 'Tablet các hãng',
        parentId: 1,
        status: 'active',
        productCount: 40
      }
    ]
  },
  {
    id: 4,
    name: 'Laptop & Máy tính',
    slug: 'laptop-may-tinh',
    description: 'Máy tính xách tay và để bàn',
    parentId: null,
    status: 'active',
    productCount: 90,
    isExpanded: false,
    children: [
      {
        id: 5,
        name: 'Laptop Gaming',
        slug: 'laptop-gaming',
        description: 'Laptop chơi game',
        parentId: 4,
        status: 'active',
        productCount: 30
      },
      {
        id: 6,
        name: 'Laptop Văn phòng',
        slug: 'laptop-van-phong',
        description: 'Laptop cho công việc',
        parentId: 4,
        status: 'active',
        productCount: 60
      }
    ]
  },
  {
    id: 7,
    name: 'Phụ kiện công nghệ',
    slug: 'phu-kien-cong-nghe',
    description: 'Các phụ kiện và thiết bị hỗ trợ',
    parentId: null,
    status: 'active',
    productCount: 200,
    isExpanded: false
  }
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleExpand = (id: number) => {
    const updateExpanded = (items: Category[]): Category[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded }
        }
        if (item.children) {
          return { ...item, children: updateExpanded(item.children) }
        }
        return item
      })
    }
    setCategories(updateExpanded(categories))
  }

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      // Logic to delete category
      console.log('Delete category:', id)
    }
  }

  const toggleStatus = (id: number) => {
    const updateStatus = (items: Category[]): Category[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
        }
        if (item.children) {
          return { ...item, children: updateStatus(item.children) }
        }
        return item
      })
    }
    setCategories(updateStatus(categories))
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    
    return (
      <div key={category.id}>
        <div 
          className={`flex items-center py-3 px-4 hover:bg-gray-50 border-b border-gray-100`}
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <div className="flex items-center flex-1">
            {hasChildren ? (
              <button 
                onClick={() => toggleExpand(category.id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {category.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6 mr-2"></div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    {category.productCount} sản phẩm
                  </span>
                  
                  <button
                    onClick={() => toggleStatus(category.id)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      category.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {category.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {hasChildren && category.isExpanded && (
          <div>
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Thêm danh mục</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {categories.map(category => renderCategory(category))}
        </div>
      </div>
    </div>
  )
}