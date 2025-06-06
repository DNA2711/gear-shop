"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function HeaderShoppingCart() {
  const [itemCount] = useState(3); // Mock cart count

  return (
    <div className="relative">
      <button className="p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-200 group">
        <ShoppingCart className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors group-hover:scale-110 transform duration-200" />
        
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-400 to-blue-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
}
