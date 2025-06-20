"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Loader2,
  Grid,
  List,
  ArrowLeft,
} from "lucide-react";
import { AddToCartButton } from "@/components/cart";
import { LoadingLink } from "@/components/ui/LoadingLink";

interface Product {
  product_id: number;
  product_name: string;
  product_code: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
  brand_name?: string;
  category_name?: string;
  primary_image?: string;
  is_active: boolean;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  message?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-gray-200"></div>
    <div className="p-4">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="w-4 h-4 bg-gray-200 rounded"></div>
        ))}
        <div className="w-8 h-3 bg-gray-200 rounded ml-2"></div>
      </div>
      <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-full h-12 bg-gray-200 rounded mb-3"></div>
      <div className="w-24 h-5 bg-gray-200 rounded mb-2"></div>
      <div className="w-32 h-6 bg-gray-200 rounded mb-3"></div>
      <div className="flex items-center justify-between">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const isMounted = useRef(false);

  // Get category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();
        if (result.success) {
          setCategories(result.data.filter((cat: any) => cat.is_active));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (
    currentPage: number = 1,
    search: string = "",
    categoryId: string | null = null
  ) => {
    try {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        is_active: "true",
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (categoryId) {
        params.append("category_id", categoryId);
      }

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) {
        throw new Error("Không thể tải danh sách sản phẩm");
      }

      const result: ProductsResponse = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Có lỗi xảy ra");
      }

      setProducts(result.data);
      setTotalPages(result.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Only fetch on initial mount
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchProducts(1, "", selectedCategory);
    }
  }, [selectedCategory]);

  // Only fetch when page changes (not on initial mount)
  useEffect(() => {
    if (isMounted.current && page > 1) {
      fetchProducts(page, searchTerm, selectedCategory);
    }
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    setSearchLoading(true);
    fetchProducts(1, searchTerm, selectedCategory);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
    fetchProducts(1, searchTerm, categoryId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get current category name for display
  const currentCategoryName = selectedCategory
    ? categories.find((cat) => cat.id.toString() === selectedCategory)?.name
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() =>
                  fetchProducts(page, searchTerm, selectedCategory)
                }
                disabled={searchLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center"
              >
                {searchLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang thử lại...
                  </>
                ) : (
                  "Thử lại"
                )}
              </button>
              <LoadingLink
                href="/"
                loadingMessage="Đang quay về trang chủ..."
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về trang chủ
              </LoadingLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentCategoryName
              ? `Danh mục: ${currentCategoryName}`
              : "Cửa hàng linh kiện"}
          </h1>
          <p className="text-gray-600">
            {currentCategoryName
              ? `Tất cả sản phẩm trong danh mục ${currentCategoryName}`
              : "Khám phá hàng nghìn sản phẩm linh kiện chất lượng cao"}
          </p>
          {currentCategoryName && (
            <button
              onClick={() => handleCategoryChange(null)}
              className="mt-2 text-blue-600 hover:text-blue-800 underline flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Xem tất cả sản phẩm
            </button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {searchLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Tìm kiếm...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </>
              )}
            </button>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {searchLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang tìm kiếm...
                  </span>
                ) : (
                  <>
                    Kết quả tìm kiếm cho <strong>"{searchTerm}"</strong>:{" "}
                    {products.length} sản phẩm
                    {products.length === 0 && (
                      <span className="ml-2">
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setPage(1);
                            fetchProducts(1, "", selectedCategory);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Xem tất cả sản phẩm
                        </button>
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 && !searchLoading ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? `Không có sản phẩm nào phù hợp với từ khóa "${searchTerm}". Hãy thử tìm kiếm với từ khóa khác.`
                : "Hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau."}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPage(1);
                  fetchProducts(1, "", selectedCategory);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem tất cả sản phẩm
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:scale-105 transition-all duration-300 group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    {product.primary_image ? (
                      <img
                        src={
                          product.primary_image.startsWith("data:")
                            ? product.primary_image
                            : `data:image/jpeg;base64,${product.primary_image}`
                        }
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">
                          Không có ảnh
                        </span>
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock_quantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock_quantity > 0 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(5.0)</span>
                    </div>

                    {/* Brand */}
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      {product.brand_name || "Chưa có thương hiệu"}
                    </p>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12 leading-6">
                      {product.product_name}
                    </h3>

                    {/* Category */}
                    <p className="text-sm text-gray-500 mb-2">
                      {product.category_name || "Chưa phân loại"}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.original_price &&
                          product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <LoadingLink
                        href={`/products/${product.product_id}`}
                        loadingMessage="Đang tải chi tiết sản phẩm..."
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Xem chi tiết
                      </LoadingLink>

                      <AddToCartButton
                        productId={product.product_id}
                        stockQuantity={product.stock_quantity}
                        disabled={product.stock_quantity === 0}
                        variant="compact"
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || searchLoading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>

                <span className="text-gray-600">
                  Trang {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || searchLoading}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
