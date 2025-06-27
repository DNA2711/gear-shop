"use client";

import React from "react";
import Image from "next/image";
import { LoadingLink } from "@/components/ui/LoadingLink";
import { ShoppingCart, Star, Eye, Heart, Zap } from "lucide-react";
import type { ProductWithDetails } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: ProductWithDetails;
  variant?: "default" | "featured";
}

function ProductCard({ product, variant = "default" }: ProductCardProps) {
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

  // Featured variant for homepage
  if (variant === "featured") {
    return (
      <div className="group relative h-full">
        <LoadingLink
          href={`/products/${product.product_id}`}
          loadingMessage="Đang tải chi tiết sản phẩm..."
          className="block h-full"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/20">
            {/* Product Image */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              {product.primary_image ? (
                <Image
                  src={
                    product.primary_image.startsWith("data:")
                      ? product.primary_image
                      : `data:image/jpeg;base64,${product.primary_image}`
                  }
                  alt={product.product_name}
                  fill
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Không có hình ảnh
                </div>
              )}

              {/* Discount Badge */}
              {discount && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{discount}%
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 flex flex-col flex-grow">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 text-yellow-400 fill-current"
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">(4.8)</span>
              </div>

              {/* Product Name */}
              <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors leading-tight min-h-[2.5rem] group-hover:text-orange-600">
                {product.product_name}
              </h3>

              {/* Price Section */}
              <div className="mb-3 mt-auto">
                {product.original_price &&
                  product.original_price > product.price && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    </div>
                  )}
                <div className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Stock and Add to Cart */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
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
                  className={`rounded-full p-2 transition-all duration-200 ${
                    product.stock_quantity && product.stock_quantity > 0
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:scale-110"
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
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </LoadingLink>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <LoadingLink
        href={`/products/${product.product_id}`}
        loadingMessage="Đang tải chi tiết sản phẩm..."
      >
        <div className="relative aspect-[4/3] bg-gray-50 p-2">
          {product.primary_image ? (
            <Image
              src={
                product.primary_image.startsWith("data:")
                  ? product.primary_image
                  : `data:image/jpeg;base64,${product.primary_image}`
              }
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
