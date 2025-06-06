'use client'

import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/contexts/CartContext'

interface AddToCartButtonProps {
  product: Omit<CartItem, 'quantity'>
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
}

export function AddToCartButton({ 
  product, 
  className = '', 
  size = 'md',
  variant = 'primary'
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setIsAdded(true)
    openCart()
    
    // Reset animation after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const variantClasses = {
    primary: isAdded 
      ? 'bg-green-600 text-white hover:bg-green-700' 
      : 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: isAdded
      ? 'border border-green-600 text-green-600 hover:bg-green-50'
      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`
        flex items-center justify-center space-x-2 rounded-lg font-medium 
        transition-all duration-200 transform hover:scale-105 active:scale-95
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4" />
          <span>Đã thêm</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          <span>Thêm vào giỏ</span>
        </>
      )}
    </button>
  )
} 