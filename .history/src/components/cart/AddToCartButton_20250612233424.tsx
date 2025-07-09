"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  productId: number;
  stockQuantity: number;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "compact";
}

function AddToCartButton({
  productId,
  stockQuantity,
  disabled = false,
  className = "",
  variant = "default",
}: AddToCartButtonProps) {
  const { addToCart, isLoading, cart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Check if product is already in cart
  const cartItem = cart.items.find((item) => item.product_id === productId);
  const currentCartQuantity = cartItem?.quantity || 0;
  const maxAvailable = stockQuantity - currentCartQuantity;

  const handleAddToCart = async () => {
    if (stockQuantity < quantity || maxAvailable <= 0) return;
    await addToCart(productId, quantity);
    if (variant === "default") {
      setQuantity(1); // Reset quantity after adding
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxAvailable) {
      setQuantity(newQuantity);
    }
  };

  if (stockQuantity === 0) {
    return (
      <div
        className={`flex items-center justify-center py-2 px-4 bg-gray-200 text-gray-500 rounded-lg ${className}`}
      >
        Hết hàng
      </div>
    );
  }

  if (maxAvailable === 0) {
    return (
      <div
        className={`flex items-center justify-center py-2 px-4 bg-yellow-100 text-yellow-700 rounded-lg ${className}`}
      >
        Đã có {currentCartQuantity} trong giỏ
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={disabled || isLoading || maxAvailable === 0}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        <ShoppingCart className="w-4 h-4" />
        {isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
      </button>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Số lượng:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="number"
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            min="1"
            max={maxAvailable}
            className="w-16 text-center border-none outline-none bg-transparent"
          />

          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= maxAvailable}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <span className="text-sm text-gray-500">(Còn lại: {maxAvailable})</span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || isLoading || maxAvailable === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        <ShoppingCart className="w-5 h-5" />
        {isLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
      </button>

      {cartItem && (
        <p className="text-sm text-green-600 text-center">
          Đã có {currentCartQuantity} sản phẩm trong giỏ hàng
        </p>
      )}
    </div>
  );
}

export default React.memo(AddToCartButton);
