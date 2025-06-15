import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import type { ProductWithDetails } from "@/types/product";

interface ProductCardProps {
  product: ProductWithDetails;
}

export default function ProductCard({ product }: ProductCardProps) {
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

  const discount = calculateDiscount();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link href={`/products/${product.product_id}`}>
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
      </Link>

      <div className="p-3">
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

        {/* Product Name - Truncated */}
        <Link href={`/products/${product.product_id}`}>
          <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
            {product.product_name}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="mb-2">
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
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Stock Status and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <span className="text-xs text-green-600 font-medium">
              {product.stock_quantity && product.stock_quantity > 0
                ? "Sẵn hàng"
                : "Hết hàng"}
            </span>
          </div>

          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
              console.log("Add to cart:", product.product_id);
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
