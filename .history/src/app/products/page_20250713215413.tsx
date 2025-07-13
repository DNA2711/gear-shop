"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [brands, setBrands] = useState<
    Array<{ brand_id: number; brand_name: string; logo_code?: string }>
  >([]);
  const [mounted, setMounted] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [manualSearchOnly, setManualSearchOnly] = useState(false);

  const getBrandsToShow = () => {
    if (showAllBrands) return brands.length;

    return 7;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const categoryParam = searchParams?.get("category");
      const brandParam = searchParams?.get("brand");
      const priceParam = searchParams?.get("price");
      const searchParam = searchParams?.get("search");

      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
      if (brandParam) {
        setSelectedBrand(brandParam);
      }
      if (priceParam) {
        setPriceRange(priceParam);
      }
      if (searchParam) {
        setSearchTerm(searchParam);
      }
    } catch (error) {
      console.error("Error getting params from URL:", error);
    }
  }, [searchParams, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const fetchCategoriesAndBrands = async () => {
      try {
        const categoriesResponse = await fetch("/api/categories");
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.success && Array.isArray(categoriesResult.data)) {
          const validCategories = categoriesResult.data
            .filter(
              (cat: any) =>
                cat.is_active && cat.category_id && cat.category_name
            )
            .map((cat: any) => ({
              id: cat.category_id,
              name: cat.category_name,
            }));
          setCategories(validCategories);
        }

        const brandsResponse = await fetch("/api/brands");
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData);
        }
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
        setCategories([]);
        setBrands([]);
      }
    };
    fetchCategoriesAndBrands();
  }, [mounted]);

  const fetchProducts = async (
    currentPage: number = 1,
    search: string = "",
    categoryId: string | null = null,
    brandId: string | null = null,
    priceRangeValue: string = "all"
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

      if (brandId) {
        params.append("brand_id", brandId);
      }

      if (priceRangeValue && priceRangeValue !== "all") {
        const [minPrice, maxPrice] = priceRangeValue.split("-");
        if (minPrice) params.append("min_price", minPrice);
        if (maxPrice && maxPrice !== "max")
          params.append("max_price", maxPrice);
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

  useEffect(() => {
    if (!mounted) return;

    setPage(1);
    fetchProducts(1, searchTerm, selectedCategory, selectedBrand, priceRange);
  }, [selectedCategory, selectedBrand, priceRange, mounted]);

  useEffect(() => {
    if (!mounted || page <= 1) return;

    fetchProducts(
      page,
      searchTerm,
      selectedCategory,
      selectedBrand,
      priceRange
    );
  }, [page, mounted]);

  const handleSearch = () => {
    if (!mounted) return;

    setSearchLoading(true);
    setPage(1);

    updateURL(selectedCategory, selectedBrand, priceRange, searchTerm);

    const searchPromise = fetchProducts(
      1,
      searchTerm,
      selectedCategory,
      selectedBrand,
      priceRange
    );
    searchPromise.finally(() => {
      setSearchLoading(false);
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    if (!mounted) return;

    const newSelectedCategory = categoryId === "all" ? null : categoryId;
    setSelectedCategory(newSelectedCategory);
    setPage(1);
    setSearchTerm("");

    updateURL(newSelectedCategory, selectedBrand, priceRange, searchTerm);
  };

  const handleBrandChange = (brandId: string) => {
    if (!mounted) return;

    const newSelectedBrand = brandId === "all" ? null : brandId;
    setSelectedBrand(newSelectedBrand);
    setPage(1);
    setSearchTerm("");

    updateURL(selectedCategory, newSelectedBrand, priceRange, searchTerm);
  };

  const handlePriceRangeChange = (priceRangeValue: string) => {
    if (!mounted) return;

    setPriceRange(priceRangeValue);
    setPage(1);
    setSearchTerm("");

    updateURL(selectedCategory, selectedBrand, priceRangeValue, searchTerm);
  };

  const updateURL = (
    categoryId: string | null,
    brandId: string | null,
    priceRangeValue: string,
    search?: string
  ) => {
    try {
      const urlParams = new URLSearchParams();
      if (categoryId) {
        urlParams.set("category", categoryId);
      }
      if (brandId) {
        urlParams.set("brand", brandId);
      }
      if (priceRangeValue && priceRangeValue !== "all") {
        urlParams.set("price", priceRangeValue);
      }
      if (search && search.trim()) {
        urlParams.set("search", search.trim());
      }
      router.push(`/products?${urlParams.toString()}`);
    } catch (error) {
      console.error("Error updating URL:", error);
    }
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

  const currentCategoryName =
    selectedCategory && categories.length > 0
      ? categories.find(
          (cat) => cat.id && cat.id.toString() === selectedCategory
        )?.name
      : null;

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

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
                  fetchProducts(
                    page,
                    searchTerm,
                    selectedCategory,
                    selectedBrand,
                    priceRange
                  )
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentCategoryName ? `Danh mục: ${currentCategoryName}` : ""}
          </h1>
          <p className="text-gray-600">
            {currentCategoryName
              ? `Tất cả sản phẩm trong danh mục ${currentCategoryName}`
              : "Khám phá hàng nghìn sản phẩm linh kiện chất lượng cao"}
          </p>
          {currentCategoryName && (
            <button
              onClick={() => handleCategoryChange("all")}
              className="mt-2 text-blue-600 hover:text-blue-800 underline flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Xem tất cả sản phẩm
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, mã sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-16 sm:pr-20 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base sm:text-lg placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {searchLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Bộ lọc tìm kiếm
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Danh mục sản phẩm
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  🏷️ Tất cả danh mục
                </button>
                {categories
                  .slice(0, showAllCategories ? categories.length : 6)
                  .map((category) =>
                    category.id ? (
                      <button
                        key={category.id}
                        onClick={() =>
                          handleCategoryChange(category.id.toString())
                        }
                        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category.id.toString()
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                        }`}
                      >
                        {category.name}
                      </button>
                    ) : null
                  )}
                {categories.length > 6 && (
                  <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 border border-dashed border-gray-300 transition-all duration-200"
                  >
                    {showAllCategories
                      ? "Thu gọn"
                      : `+${categories.length - 6} khác`}
                  </button>
                )}
              </div>
            </div>

            {brands.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Chọn thương hiệu yêu thích
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
                  <button
                    onClick={() => handleBrandChange("all")}
                    className={`group relative p-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                      !selectedBrand
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg ring-2 ring-blue-200"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                    title="Tất cả thương hiệu"
                  >
                    <div className="flex flex-col items-center justify-center h-8 sm:h-10">
                      <div
                        className={`text-sm sm:text-base mb-1 transition-transform group-hover:scale-110 ${
                          !selectedBrand ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        🏢
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          !selectedBrand ? "text-blue-700" : "text-gray-600"
                        }`}
                      >
                        Tất cả
                      </span>
                    </div>
                    {!selectedBrand && (
                      <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-10"></div>
                    )}
                  </button>

                  {brands.slice(0, getBrandsToShow()).map((brand) => (
                    <button
                      key={brand.brand_id}
                      onClick={() =>
                        handleBrandChange(brand.brand_id.toString())
                      }
                      className={`group relative p-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                        selectedBrand === brand.brand_id.toString()
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg ring-2 ring-blue-200"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                      title={brand.brand_name}
                    >
                      <div className="flex flex-col items-center justify-center h-8 sm:h-10">
                        {brand.logo_code ? (
                          <img
                            src={brand.logo_code}
                            alt={brand.brand_name}
                            className="w-full h-3 sm:h-5 object-contain transition-transform group-hover:scale-110"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const fallback =
                                target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`flex flex-col items-center justify-center h-3 sm:h-5 ${
                            brand.logo_code ? "hidden" : ""
                          }`}
                        >
                          <span
                            className={`text-xs font-bold transition-transform group-hover:scale-110 ${
                              selectedBrand === brand.brand_id.toString()
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          >
                            {brand.brand_name.charAt(0)}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-medium mt-1 truncate block w-full text-center ${
                            selectedBrand === brand.brand_id.toString()
                              ? "text-blue-700"
                              : "text-gray-600"
                          }`}
                        >
                          {brand.brand_name.length > 6
                            ? brand.brand_name.substring(0, 6) + "..."
                            : brand.brand_name}
                        </span>
                      </div>
                      {selectedBrand === brand.brand_id.toString() && (
                        <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-10"></div>
                      )}
                    </button>
                  ))}

                  {brands.length > 7 && (
                    <button
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="group relative p-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                      title="Xem thêm thương hiệu"
                    >
                      <div className="flex flex-col items-center justify-center h-8 sm:h-10">
                        <div className="text-sm sm:text-base mb-1 text-gray-500 transition-transform group-hover:scale-110">
                          {showAllBrands ? "−" : "+"}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {showAllBrands ? "Thu gọn" : `${brands.length - 7}`}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Khoảng giá
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => handlePriceRangeChange("all")}
                  className={`px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    priceRange === "all"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  💰 Tất cả
                </button>
                <button
                  onClick={() => handlePriceRangeChange("0-1000000")}
                  className={`px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    priceRange === "0-1000000"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  Dưới 1 triệu
                </button>
                <button
                  onClick={() => handlePriceRangeChange("1000000-5000000")}
                  className={`px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    priceRange === "1000000-5000000"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  1-5 triệu
                </button>
                <button
                  onClick={() => handlePriceRangeChange("5000000-10000000")}
                  className={`px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    priceRange === "5000000-10000000"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  5-10 triệu
                </button>
                <button
                  onClick={() => handlePriceRangeChange("10000000-20000000")}
                  className={`px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    priceRange === "10000000-20000000"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  10-20 triệu
                </button>
                <button
                  onClick={() => handlePriceRangeChange("20000000-max")}
                  className={`px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    priceRange === "20000000-max"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  Trên 20 triệu
                </button>
              </div>
            </div>

            {(selectedCategory ||
              selectedBrand ||
              searchTerm ||
              priceRange !== "all") && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700 w-full sm:w-auto mb-2 sm:mb-0">
                  Bộ lọc hiện tại:
                </span>

                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      {
                        categories.find(
                          (c) => c.id?.toString() === selectedCategory
                        )?.name
                      }
                      <button
                        onClick={() => handleCategoryChange("all")}
                        className="ml-1 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {selectedBrand && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm bg-purple-100 text-purple-800">
                      {
                        brands.find(
                          (b) => b.brand_id.toString() === selectedBrand
                        )?.brand_name
                      }
                      <button
                        onClick={() => handleBrandChange("all")}
                        className="ml-1 hover:text-purple-600"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {priceRange !== "all" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm bg-green-100 text-green-800">
                      💰 {priceRange === "0-1000000" && "Dưới 1 triệu"}
                      {priceRange === "1000000-5000000" && "1-5 triệu"}
                      {priceRange === "5000000-10000000" && "5-10 triệu"}
                      {priceRange === "10000000-20000000" && "10-20 triệu"}
                      {priceRange === "20000000-max" && "Trên 20 triệu"}
                      <button
                        onClick={() => handlePriceRangeChange("all")}
                        className="ml-1 hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm bg-yellow-100 text-yellow-800">
                      "{searchTerm}"
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          handleSearch();
                        }}
                        className="ml-1 hover:text-yellow-600"
                      >
                        ×
                      </button>
                    </span>
                  )}

                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedBrand(null);
                      setSearchTerm("");
                      setPriceRange("all");
                      updateURL(null, null, "all", "");
                      fetchProducts(1, "", null, null, "all");
                    }}
                    className="px-3 py-1 text-xs sm:text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            )}

            {(searchTerm ||
              selectedCategory ||
              selectedBrand ||
              priceRange !== "all") && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {searchLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang tìm kiếm...
                    </span>
                  ) : (
                    <>
                      Hiển thị {products.length} sản phẩm
                      {searchTerm && ` cho "${searchTerm}"`}
                      {selectedCategory &&
                        ` trong ${
                          categories.find(
                            (c) => c.id?.toString() === selectedCategory
                          )?.name
                        }`}
                      {selectedBrand &&
                        ` của ${
                          brands.find(
                            (b) => b.brand_id.toString() === selectedBrand
                          )?.brand_name
                        }`}
                      {priceRange !== "all" && (
                        <>
                          {" với giá "}
                          {priceRange === "0-1000000" && "dưới 1 triệu"}
                          {priceRange === "1000000-5000000" && "1-5 triệu"}
                          {priceRange === "5000000-10000000" && "5-10 triệu"}
                          {priceRange === "10000000-20000000" && "10-20 triệu"}
                          {priceRange === "20000000-max" && "trên 20 triệu"}
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {products.length === 0 && !searchLoading ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {currentCategoryName
                ? `Hiện tại chưa có sản phẩm nào trong danh mục "${currentCategoryName}". Vui lòng thử danh mục khác hoặc xem tất cả sản phẩm.`
                : searchTerm || selectedBrand || priceRange !== "all"
                ? `Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.`
                : "Hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau."}
            </p>
            {(searchTerm ||
              selectedCategory ||
              selectedBrand ||
              priceRange !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setPriceRange("all");
                  setPage(1);
                  updateURL(null, null, "all", "");
                  fetchProducts(1, "", null, null, "all");
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
                <LoadingLink
                  key={product.product_id}
                  href={`/products/${product.product_id}`}
                  loadingMessage="Đang tải chi tiết sản phẩm..."
                  className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
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

                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(5.0)</span>
                    </div>

                    <p className="text-sm text-blue-600 font-medium mb-1">
                      {product.brand_name || "Chưa có thương hiệu"}
                    </p>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12 leading-6">
                      {product.product_name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-2">
                      {product.category_name || "Chưa phân loại"}
                    </p>

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

                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 text-sm font-medium">
                        Click để xem chi tiết
                      </span>

                      <AddToCartButton
                        productId={product.product_id}
                        stockQuantity={product.stock_quantity}
                        disabled={product.stock_quantity === 0}
                        variant="compact"
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </LoadingLink>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || searchLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Trang trước
                </button>

                <span className="text-gray-600 text-sm sm:text-base order-first sm:order-none">
                  Trang {page} / {totalPages}
                </span>

                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || searchLoading}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
