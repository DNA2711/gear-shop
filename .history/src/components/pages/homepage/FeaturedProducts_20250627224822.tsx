"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApi } from "@/hooks/useApi";
import ProductCard from "@/components/ui/ProductCard";
import { LoadingLink } from "@/components/ui/LoadingLink";
import {
  Zap,
  Star,
  ArrowRight,
  TrendingUp,
  Fire,
  ShoppingBag,
  Trophy,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { ProductWithDetails } from "@/types/product";

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full animate-pulse">
    <div className="aspect-[4/3] bg-gray-200"></div>
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);
  const api = useApi();

  const fetchProducts = async () => {
    try {
      const result = await api.get("/api/products?limit=12&is_active=true", {
        loadingMessage: "Đang tải sản phẩm nổi bật...",
      });
      // API returns object with 'data' property containing array
      const products = Array.isArray(result) ? result : result.data || [];
      // Take first 12 products for featured section
      setProducts(products.slice(0, 12));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      fetchProducts();
    }
  }, []);

  if (error) {
    return (
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
              Sản phẩm nổi bật
            </h2>
            <div className="text-center text-red-400 bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4 max-w-md mx-auto">
              Lỗi khi tải sản phẩm: {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Hot Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-2xl backdrop-blur-sm animate-pulse">
            <Fire className="w-5 h-5 mr-2 animate-bounce" />
            <span className="relative">
              🔥 HOT PRODUCTS 🔥
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6 leading-tight">
            Sản Phẩm
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Bán Chạy Nhất
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-300 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
            Những linh kiện máy tính{" "}
            <span className="text-orange-400 font-semibold">
              được săn đón nhiều nhất
            </span>{" "}
            với
            <span className="text-red-400 font-semibold">
              {" "}
              công nghệ tiên tiến
            </span>{" "}
            và
            <span className="text-yellow-400 font-semibold">
              {" "}
              giá cả hấp dẫn
            </span>
          </p>

          {/* Stats Row */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2 text-slate-300">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">Top Seller</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">Trending Now</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
          </div>

          {/* Decorative Stars */}
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-yellow-400 fill-current animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-16">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="group h-full">
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden h-full animate-pulse">
                    <div className="aspect-[4/3] bg-slate-700/50"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-700/50 rounded"></div>
                      <div className="h-3 bg-slate-700/50 rounded w-3/4"></div>
                      <div className="h-5 bg-slate-700/50 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.product_id}
                  className="group h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 h-full transform hover:-translate-y-2">
                    {/* Hot Badge */}
                    {index < 3 && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                          🔥 HOT #{index + 1}
                        </div>
                      </div>
                    )}

                    {/* Trending Badge */}
                    {index >= 3 && index < 6 && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          ⭐ TRENDING
                        </div>
                      </div>
                    )}

                                        {/* Glow Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-red-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-red-500/5 group-hover:to-orange-500/10 transition-all duration-500 rounded-2xl"></div>
                    
                    <ProductCard product={product} variant="featured" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/50 max-w-2xl mx-auto">
            <div className="mb-6">
              <ShoppingBag className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Khám phá thêm nhiều sản phẩm
              </h3>
              <p className="text-slate-300 text-lg">
                Hơn{" "}
                <span className="text-orange-400 font-semibold">
                  1000+ sản phẩm
                </span>{" "}
                đang chờ bạn khám phá
              </p>
            </div>

            <LoadingLink
              href="/products"
              loadingMessage="Đang tải tất cả sản phẩm..."
              className="group inline-flex items-center bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-700 hover:via-red-700 hover:to-orange-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg transform hover:-translate-y-1"
            >
              <span className="relative">
                Xem Tất Cả Sản Phẩm
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </span>
              <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </LoadingLink>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: <TrendingUp className="w-8 h-8" />,
              number: "1000+",
              label: "Sản phẩm có sẵn",
              color: "from-blue-400 to-cyan-400",
            },
            {
              icon: <Zap className="w-8 h-8" />,
              number: "24/7",
              label: "Hỗ trợ kỹ thuật",
              color: "from-purple-400 to-pink-400",
            },
            {
              icon: <Trophy className="w-8 h-8" />,
              number: "5⭐",
              label: "Đánh giá trung bình",
              color: "from-yellow-400 to-orange-400",
            },
            {
              icon: <Fire className="w-8 h-8" />,
              number: "Miễn phí",
              label: "Vận chuyển toàn quốc",
              color: "from-green-400 to-emerald-400",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="group text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{stat.icon}</div>
              </div>
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
              >
                {stat.number}
              </div>
              <div className="text-slate-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
