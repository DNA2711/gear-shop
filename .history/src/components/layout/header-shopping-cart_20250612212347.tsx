"use client";

import CartWidget from "@/components/cart/CartWidget";

export default function HeaderShoppingCart() {
  return (
    <CartWidget className="p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-200 group text-blue-400 hover:text-blue-300" />
  );
}
