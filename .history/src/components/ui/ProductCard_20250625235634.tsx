"use client";

import React from "react";
import Image from "next/image";
import { LoadingLink } from "@/components/ui/LoadingLink";
import { ShoppingCart, Star } from "lucide-react";
import type { ProductWithDetails } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: ProductWithDetails;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const calculateDiscount = () => {
    if (product.original_price && product.original_price > product.price) {
      const discountPercent = Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      );
      return discountPercent;
    }
    return null;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity && product.stock_quantity > 0) {
      await addToCart(product.product_id, 1);
    }
  };

  const discount = calculateDiscount();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <LoadingLink
        href={`/products/${product.product_id}`}
        loadingMessage="Đang tải chi tiết sản phẩm..."
      >
        <div className="relative aspect-[4/3] bg-gray-50 p-2">
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.product_name}
              fill
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Không có hình ảnh
            </div>
          )}
        </div>
      </LoadingLink>

      <div className="p-3 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 text-gray-300" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(0)</span>
        </div>

        {/* Product Code - Shortened */}
        <p className="text-xs text-gray-500 mb-1">
          MÃ:{" "}
          {product.product_code.length > 15
            ? product.product_code.substring(0, 15) + "..."
            : product.product_code}
        </p>

        {/* Product Name - Truncated to ensure consistent height */}
        <LoadingLink
          href={`/products/${product.product_id}`}
          loadingMessage="Đang tải chi tiết sản phẩm..."
        >
          <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-tight min-h-[2.5rem]">
            {product.product_name}
          </h3>
        </LoadingLink>

        {/* Price Section */}
        <div className="mb-2 mt-auto">
          {product.original_price && product.original_price > product.price && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
              {discount && (
                <span className="text-xs text-red-600 font-medium">
                  -{discount}%
                </span>
              )}
            </div>
          )}
          <div className="text-lg font-bold text-gray-900 price-text">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Stock Status and Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.stock_quantity && product.stock_quantity > 0
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
            <span
              className={`text-xs font-medium ${
                product.stock_quantity && product.stock_quantity > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.stock_quantity && product.stock_quantity > 0
                ? "Sẵn hàng"
                : "Hết hàng"}
            </span>
          </div>

          <button
            className={`rounded-full p-1.5 transition-colors duration-200 ${
              product.stock_quantity && product.stock_quantity > 0
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleAddToCart}
            disabled={
              !product.stock_quantity ||
              product.stock_quantity <= 0 ||
              isLoading
            }
            title={
              product.stock_quantity && product.stock_quantity > 0
                ? "Thêm vào giỏ hàng"
                : "Hết hàng"
            }
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
