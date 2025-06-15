"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductWithDetails } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import ProductBreadcrumb from "./ProductBreadcrumb";
import RelatedProducts from "./RelatedProducts";
import { AddToCartButton } from "@/components/cart";

interface ProductDetailProps {
  product: ProductWithDetails;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  const currentImage =
    product.images?.[currentImageIndex] || product.images?.[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const calculateDiscount = () => {
    if (product.original_price && product.original_price > product.price) {
      const discountPercent = Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      );
      const discountAmount = product.original_price - product.price;
      return { percent: discountPercent, amount: discountAmount };
    }
    return null;
  };

  const discount = calculateDiscount();
  const onlinePrice = product.price - product.price * 0.05; // 5% discount for online purchase

  // Navigation functions for main image
  const goToPrevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images!.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === product.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Get product specifications from database or use empty array
  const specifications = product.specifications || [];

  const displayedSpecs = showFullSpecs
    ? specifications
    : specifications.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <ProductBreadcrumb product={product} />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Left Column - Image Gallery with Horizontal Layout */}
          <div className="space-y-4">
            <div className="flex gap-4">
              {/* Thumbnail Gallery - Left Side */}
              {product.images && product.images.length > 1 && (
                <div className="flex flex-col gap-2 w-20">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image.image_code}
                        alt={image.image_name}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image - Right Side */}
              <div className="flex-1 relative">
                <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  {currentImage ? (
                    <Image
                      src={currentImage.image_code}
                      alt={currentImage.image_name}
                      fill
                      className="object-contain p-4"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Không có hình ảnh
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {product.images && product.images.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={goToPrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {/* Next Button */}
                      <button
                        onClick={goToNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Thumbnail Gallery - Bottom (hidden on desktop when images > 1) */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto lg:hidden">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.image_code}
                      alt={image.image_name}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.product_name}
              </h1>

              {/* Product Code and Rating */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>
                  Mã SP:{" "}
                  <span className="text-blue-600 font-medium">
                    {product.product_code}
                  </span>
                </span>
                <span>|</span>
                <div className="flex items-center gap-1">
                  <span>Đánh giá:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-300" />
                  ))}
                  <span>0</span>
                </div>
                <span>|</span>
                <span>Bình luận: 0</span>
                <span>|</span>
                <span>Lượt xem: 3,285</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Thông số sản phẩm</h3>
              <div className="space-y-0 overflow-hidden">
                {specifications.length > 0 ? (
                  displayedSpecs.map((spec, index) => {
                    // Check if spec_value contains line breaks
                    const hasMultipleLines = spec.spec_value.includes("\n");
                    const lines = spec.spec_value.split("\n");

                    return (
                      <div
                        key={index}
                        className={`p-3 text-sm flex ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <div className="w-1/3 font-medium text-gray-700 flex-shrink-0">
                          {spec.spec_name}
                        </div>
                        <div className="w-2/3 text-gray-900">
                          {hasMultipleLines ? (
                            <ul className="space-y-1">
                              {lines.map((line, lineIndex) => (
                                <li
                                  key={lineIndex}
                                  className="flex items-start"
                                >
                                  <span className="text-gray-400 mr-2 mt-0.5">
                                    •
                                  </span>
                                  <span>{line.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            spec.spec_value
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-sm text-gray-500 bg-gray-50">
                    Chưa có thông số kỹ thuật cho sản phẩm này
                  </div>
                )}

                {specifications.length > 4 && (
                  <div className="p-3 border-t border-gray-200 flex justify-center">
                    <button
                      onClick={() => setShowSpecsModal(true)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium uppercase tracking-wide"
                    >
                      XEM THÊM THÔNG SỐ
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Giá Khuyến mãi:
                </p>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price &&
                    product.original_price > product.price && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                        {discount && (
                          <span className="text-sm text-red-600 font-medium">
                            Tiết kiệm: {formatPrice(discount.amount)}
                          </span>
                        )}
                      </>
                    )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Giá đã bao gồm VAT
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Bảo hành: 24 Tháng (Pin 12 Tháng)
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Số lượng:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-green-600 font-medium">
                    {product.stock_quantity && product.stock_quantity > 0
                      ? "Sẵn hàng"
                      : "Hết hàng"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  THÊM VÀO GIỎ HÀNG
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          categoryId={product.category_id || 0}
          currentProductId={product.product_id}
        />
      </div>

      {/* Specifications Modal */}
      {showSpecsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSpecsModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] mx-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Thông số kỹ thuật - {product.product_name}
              </h2>
              <button
                onClick={() => setShowSpecsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                {specifications.map((spec, index) => {
                  const hasMultipleLines = spec.spec_value.includes("\n");
                  const lines = spec.spec_value.split("\n");

                  return (
                    <div
                      key={index}
                      className={`p-4 text-sm flex ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="w-1/3 font-medium text-gray-700 flex-shrink-0">
                        {spec.spec_name}
                      </div>
                      <div className="w-2/3 text-gray-900">
                        {hasMultipleLines ? (
                          <ul className="space-y-1">
                            {lines.map((line, lineIndex) => (
                              <li key={lineIndex} className="flex items-start">
                                <span className="text-gray-400 mr-2 mt-0.5">
                                  •
                                </span>
                                <span>{line.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          spec.spec_value
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowSpecsModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
