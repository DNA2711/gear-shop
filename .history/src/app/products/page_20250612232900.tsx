"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Star, ShoppingCart } from "lucide-react";
import { AddToCartButton } from "@/components/cart";

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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (
    currentPage: number = 1,
    search: string = ""
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        is_active: "true",
      });

      if (search.trim()) {
        params.append("search", search.trim());
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, searchTerm);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts(1, searchTerm);
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

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải sản phẩm...</p>
            </div>
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
            <div className="text-red-600 mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchProducts(page, searchTerm)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">🛍️ Danh sách sản phẩm</h1>
            <p className="text-blue-100 text-lg">
              Khám phá hàng ngàn sản phẩm công nghệ chất lượng cao
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-6 relative z-10">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-blue-100">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Không tìm thấy sản phẩm nào
            </h2>
            <p className="text-gray-600 mb-6">
              Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setPage(1);
                fetchProducts(1, "");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {product.primary_image ? (
                      <img
                        src={`data:image/jpeg;base64,${product.primary_image}`}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                          <span className="text-sm">Không có ảnh</span>
                        </div>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.original_price &&
                        product.original_price > product.price && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                            SALE
                          </span>
                        )}
                      {product.stock_quantity === 0 && (
                        <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-lg">
                          HẾT HÀNG
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                        {product.product_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Mã: {product.product_code}</span>
                        {product.brand_name && (
                          <>
                            <span>•</span>
                            <span>{product.brand_name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.original_price &&
                          product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                      </div>

                      {/* Stock */}
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            product.stock_quantity > 0
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${
                            product.stock_quantity > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock_quantity > 0
                            ? `Còn ${product.stock_quantity} sản phẩm`
                            : "Hết hàng"}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart */}
                    <AddToCartButton
                      productId={product.product_id}
                      stockQuantity={product.stock_quantity}
                      variant="compact"
                      className="w-full"
                      disabled={product.stock_quantity === 0}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1 || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Trước
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          disabled={loading}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            page === pageNumber
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2">...</span>
                        <button
                          onClick={() => setPage(totalPages)}
                          disabled={loading || page === totalPages}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau
                  </button>
                </div>

                <div className="text-center mt-4 text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
