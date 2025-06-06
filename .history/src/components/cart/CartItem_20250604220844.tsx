'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { CartItem as CartItemType } from '@/contexts/CartContext'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const currentPrice = item.salePrice || item.price
  const totalPrice = currentPrice * item.quantity

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-medium text-gray-500">IMG</span>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {item.brand} • {item.sku}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          {item.salePrice ? (
            <>
              <span className="text-sm font-semibold text-red-600">
                {formatPrice(item.salePrice)}
              </span>
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(item.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(item.price)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          {formatPrice(totalPrice)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
} 