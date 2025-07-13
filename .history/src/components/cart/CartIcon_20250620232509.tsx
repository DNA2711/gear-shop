"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { LoadingLink } from "@/components/ui/LoadingLink";

interface CartIconProps {
  className?: string;
}

export default function CartIcon({ className = "" }: CartIconProps) {
  const { cart } = useCart();

  return (
    <LoadingLink
      href="/cart"
      loadingMessage="Đang tải giỏ hàng..."
      className={`relative inline-flex items-center justify-center ${className}`}
      aria-label={`Giỏ hàng (${cart.total_items} sản phẩm)`}
    >
      <ShoppingBag className="w-6 h-6 group-hover:text-blue-300 transition-colors group-hover:scale-110 transform duration-200" />

      {cart.total_items > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-400 to-blue-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {cart.total_items > 99 ? "99+" : cart.total_items}
        </span>
      )}
    </LoadingLink>
  );
}
