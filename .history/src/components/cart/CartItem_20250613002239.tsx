"use client";

import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
  variant?: "default" | "checkout";
  isSelected?: boolean;
  onSelect?: (productId: number, checked: boolean) => void;
}

export default function CartItem({ item, variant = "default", isSelected = true, onSelect }: CartItemProps) {
  const { updateCartItem, removeFromCart, isLoading } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(item.product_id);
    } else if (newQuantity <= item.stock_quantity) {
      await updateCartItem(item.product_id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.product_id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalPrice = item.price * item.quantity;
  const hasDiscount = item.original_price && item.original_price > item.price;

  return (
    <div className="flex items-center gap-4 p-4">
      {/* Checkbox */}
      <div className="flex-shrink-0">
        <div className="relative">
          <input
            type="checkbox"
            defaultChecked={true}
            className="sr-only peer"
            id={`product-${item.product_id}`}
          />
          <label
            htmlFor={`product-${item.product_id}`}
            className="w-5 h-5 bg-gray-100 rounded-md peer-checked:bg-blue-600 transition-all duration-200 cursor-pointer flex items-center justify-center hover:bg-gray-200 peer-checked:hover:bg-blue-700"
          >
            <svg
              className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </label>
        </div>
      </div>

      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        {item.primary_image ? (
          <img
            src={
              item.primary_image.startsWith("data:")
                ? item.primary_image
                : `data:image/jpeg;base64,${item.primary_image}`
            }
            alt={item.product_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML =
                  '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-xs text-center">Lỗi ảnh</span></div>';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xs text-center">Không có ảnh</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {item.product_name}
        </h3>

        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          <span>Mã: {item.product_code}</span>
          {item.brand_name && (
            <>
              <span>•</span>
              <span>{item.brand_name}</span>
            </>
          )}
          {item.quantity > item.stock_quantity && (
            <>
              <span>•</span>
              <span className="text-red-600">Còn {item.stock_quantity}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-gray-900">
            {formatPrice(item.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(item.original_price!)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      {variant === "default" && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Giảm số lượng"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-8 text-center font-medium">{item.quantity}</span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isLoading || item.quantity >= item.stock_quantity}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Tăng số lượng"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quantity display for checkout */}
      {variant === "checkout" && (
        <div className="text-center">
          <span className="font-medium">SL: {item.quantity}</span>
        </div>
      )}

      {/* Total Price */}
      <div className="text-right min-w-[100px]">
        <div className="font-semibold text-gray-900">
          {formatPrice(totalPrice)}
        </div>

        {item.quantity > 1 && (
          <div className="text-sm text-gray-500">
            {formatPrice(item.price)} × {item.quantity}
          </div>
        )}
      </div>

      {/* Remove Button */}
      {variant === "default" && (
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Xóa sản phẩm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
