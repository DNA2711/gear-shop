"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductWithDetails } from "@/types/product";
import { Star, Zap, ArrowRight } from "lucide-react";

const ProductCardSkeleton = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-slate-700/50"></div>
    <div className="p-3">
      <div className="flex items-center gap-1 mb-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="w-3 h-3 bg-slate-700/50 rounded"></div>
        ))}
        <div className="w-6 h-3 bg-slate-700/50 rounded ml-1"></div>
      </div>
      <div className="w-16 h-3 bg-slate-700/50 rounded mb-1"></div>
      <div className="w-full h-8 bg-slate-700/50 rounded mb-2"></div>
      <div className="w-20 h-4 bg-slate-700/50 rounded mb-1"></div>
      <div className="w-24 h-6 bg-slate-700/50 rounded mb-2"></div>
      <div className="flex items-center justify-between">
        <div className="w-12 h-3 bg-slate-700/50 rounded"></div>
        <div className="w-6 h-6 bg-slate-700/50 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const result = await response.json();
        // API returns object with 'data' property containing array
        const products = Array.isArray(result) ? result : result.data || [];
        // Take first 8 products for featured section
        setProducts(products.slice(0, 8));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden scroll-section">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
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
    <section className="py-12 relative overflow-hidden scroll-section">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-lg backdrop-blur-sm">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            HOT PRODUCTS
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 leading-tight">
            Sản phẩm nổi bật
          </h2>

          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Khám phá những linh kiện máy tính hàng đầu với công nghệ tiên tiến
            nhất
          </p>

          {/* Decorative Stars */}
          <div className="flex justify-center mt-6 space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Products Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : products.map((product) => (
                <div key={product.product_id} className="group">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
            Xem tất cả sản phẩm
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Stats - Responsive */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">500+</div>
            <div className="text-slate-300 text-sm sm:text-base">Sản phẩm có sẵn</div>
          </div>
          <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">24/7</div>
            <div className="text-slate-300 text-sm sm:text-base">Hỗ trợ kỹ thuật</div>
          </div>
          <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2">
              Miễn phí
            </div>
            <div className="text-slate-300 text-sm sm:text-base">Vận chuyển toàn quốc</div>
          </div>
        </div>
      </div>
    </section>
  );
}
