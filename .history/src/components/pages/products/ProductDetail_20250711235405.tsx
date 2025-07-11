"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductWithDetails } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
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
  const onlinePrice = product.price - product.price * 0.05;

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

  const specifications = product.specifications || [];

  const displayedSpecs = showFullSpecs
    ? specifications
    : specifications.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <ProductBreadcrumb product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8">
          <div className="space-y-4">
            <div className="lg:hidden">
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

                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
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

            <div className="hidden lg:flex gap-4">
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

                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={goToPrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={goToNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {product.product_name}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
                <span>
                  Mã SP:{" "}
                  <span className="text-blue-600 font-medium">
                    {product.product_code}
                  </span>
                </span>
                <span className="hidden sm:inline">|</span>
                <div className="flex items-center gap-1">
                  <span>Đánh giá:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-gray-300" />
                  ))}
                  <span>0</span>
                </div>
                <span className="hidden sm:inline">|</span>
                <span>Bình luận: 0</span>
                <span className="hidden sm:inline">|</span>
                <span>Lượt xem: 3,285</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Thông số sản phẩm</h3>
              <div className="space-y-0 overflow-hidden">
                {specifications.length > 0 ? (
                  displayedSpecs.map((spec, index) => {
                    const hasMultipleLines = spec.spec_value.includes("\n");
                    const lines = spec.spec_value.split("\n");

                    return (
                      <div
                        key={index}
                        className={`p-3 text-sm flex flex-col sm:flex-row ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <div className="sm:w-1/3 font-medium text-gray-700 flex-shrink-0 mb-1 sm:mb-0">
                          {spec.spec_name}
                        </div>
                        <div className="sm:w-2/3 text-gray-900">
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

            <div className="space-y-4">
              <div>
                <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                  Giá Khuyến mãi:
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price &&
                    product.original_price > product.price && (
                      <>
                        <span className="text-base sm:text-lg text-gray-500 line-through">
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
                {discount && (
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    Giảm {discount.percent}%
                  </span>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 mb-1">
                  💻 Giá thanh toán online (Tiết kiệm thêm 5%):
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-blue-600">
                    {formatPrice(onlinePrice)}
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    (Tiết kiệm {formatPrice(product.price - onlinePrice)})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-green-600 font-medium">
                  {product.stock_quantity && product.stock_quantity > 0
                    ? `Còn ${product.stock_quantity} sản phẩm`
                    : "Hết hàng"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <AddToCartButton
                    productId={product.product_id}
                    stockQuantity={product.stock_quantity || 0}
                  />
                </div>
                <div className="flex gap-2 sm:gap-4">
                  <button className="flex-1 sm:flex-none p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600 mx-auto" />
                  </button>
                  <button className="flex-1 sm:flex-none p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts
          categoryId={product.category_id || 0}
          currentProductId={product.product_id}
        />
      </div>

      {showSpecsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSpecsModal(false)}
          />

          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 pr-4 line-clamp-2">
                Thông số kỹ thuật - {product.product_name}
              </h2>
              <button
                onClick={() => setShowSpecsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                {specifications.map((spec, index) => {
                  const hasMultipleLines = spec.spec_value.includes("\n");
                  const lines = spec.spec_value.split("\n");

                  return (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 text-sm flex flex-col sm:flex-row ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="sm:w-1/3 font-medium text-gray-700 flex-shrink-0 mb-1 sm:mb-0">
                        {spec.spec_name}
                      </div>
                      <div className="sm:w-2/3 text-gray-900">
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

            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
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
