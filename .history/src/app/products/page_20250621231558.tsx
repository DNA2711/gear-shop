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
  const isMounted = useRef(false);

  // Track component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get category, brand and price range from URL params
  useEffect(() => {
    if (!mounted) return;

    try {
      const categoryParam = searchParams?.get("category");
      const brandParam = searchParams?.get("brand");
      const priceParam = searchParams?.get("price");
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
      if (brandParam) {
        setSelectedBrand(brandParam);
      }
      if (priceParam) {
        setPriceRange(priceParam);
      }
    } catch (error) {
      console.error("Error getting params from URL:", error);
    }
  }, [searchParams, mounted]);

  // Fetch categories and brands
  useEffect(() => {
    if (!mounted) return;

    const fetchCategoriesAndBrands = async () => {
      try {
        // Fetch categories
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

        // Fetch brands
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

      // Add price range filter
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

  // Only fetch on initial mount
  useEffect(() => {
    if (!mounted || isMounted.current) return;

    isMounted.current = true;
    fetchProducts(1, "", selectedCategory, selectedBrand, priceRange);
  }, [selectedCategory, selectedBrand, priceRange, mounted]);

  // Only fetch when page changes (not on initial mount)
  useEffect(() => {
    if (!mounted || !isMounted.current || page <= 1) return;

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
    isMounted.current = true; // Allow re-fetch

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

    // Update URL
    updateURL(newSelectedCategory, selectedBrand, priceRange);

    // Refetch products
    isMounted.current = true; // Allow re-fetch
    fetchProducts(1, "", newSelectedCategory, selectedBrand, priceRange);
  };

  const handleBrandChange = (brandId: string) => {
    if (!mounted) return;

    const newSelectedBrand = brandId === "all" ? null : brandId;
    setSelectedBrand(newSelectedBrand);
    setPage(1);
    setSearchTerm("");

    // Update URL
    updateURL(selectedCategory, newSelectedBrand, priceRange);

    // Refetch products
    isMounted.current = true; // Allow re-fetch
    fetchProducts(1, "", selectedCategory, newSelectedBrand, priceRange);
  };

  const handlePriceRangeChange = (priceRangeValue: string) => {
    if (!mounted) return;

    setPriceRange(priceRangeValue);
    setPage(1);
    setSearchTerm("");

    // Update URL
    updateURL(selectedCategory, selectedBrand, priceRangeValue);

    // Refetch products
    isMounted.current = true; // Allow re-fetch
    fetchProducts(1, "", selectedCategory, selectedBrand, priceRangeValue);
  };

  const updateURL = (
    categoryId: string | null,
    brandId: string | null,
    priceRangeValue: string
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

  // Get current category name for display - safely
  const currentCategoryName =
    selectedCategory && categories.length > 0
      ? categories.find(
          (cat) => cat.id && cat.id.toString() === selectedCategory
        )?.name
      : null;

  // Show loading skeleton if not mounted or still loading
  if (!mounted || loading) {
    return (
      <div className="min-h-screen seamless-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Sản phẩm</h1>
                <div className="flex items-center space-x-4">
                  <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white backdrop-blur-sm">
                    <option value="">Tất cả danh mục</option>
                    <option value="cpu">CPU</option>
                    <option value="gpu">GPU</option>
                    <option value="ram">RAM</option>
                  </select>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Lọc
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 animate-pulse">
                      <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                      <div className="h-4 bg-white/10 rounded mb-2"></div>
                      <div className="h-4 bg-white/10 rounded mb-4 w-3/4"></div>
                      <div className="h-6 bg-white/10 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-lg text-center">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div key={product.product_id} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={product.primary_image || '/images/default-product.jpg'}
                          alt={product.product_name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                          {product.product_name}
                        </h3>
                        <p className="text-white/70 text-sm mb-4 line-clamp-2">
                          {product.category_name || "Chưa phân loại"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-blue-400">
                            {formatPrice(product.price)}
                          </span>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                    Trước
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    1
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                    2
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                    3
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen seamless-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">Sản phẩm</h1>
              <div className="flex items-center space-x-4">
                <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white backdrop-blur-sm">
                  <option value="">Tất cả danh mục</option>
                  <option value="cpu">CPU</option>
                  <option value="gpu">GPU</option>
                  <option value="ram">RAM</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Lọc
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 animate-pulse">
                    <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded mb-4 w-3/4"></div>
                    <div className="h-6 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.product_id} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={product.primary_image || '/images/default-product.jpg'}
                        alt={product.product_name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {product.product_name}
                      </h3>
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {product.category_name || "Chưa phân loại"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-400">
                          {formatPrice(product.price)}
                        </span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  Trước
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  1
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  2
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  3
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
