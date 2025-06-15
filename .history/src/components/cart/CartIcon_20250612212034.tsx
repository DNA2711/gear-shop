'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

export default function CartIcon({ onClick, className = '' }: CartIconProps) {
  const { cart } = useCart();

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      aria-label={`Giỏ hàng (${cart.total_items} sản phẩm)`}
    >
      <ShoppingBag className="w-6 h-6" />
      
      {cart.total_items > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
          {cart.total_items > 99 ? '99+' : cart.total_items}
        </span>
      )}
    </button>
  );
} 