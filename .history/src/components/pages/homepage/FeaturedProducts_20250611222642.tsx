"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductWithDetails } from "@/types/product";
import { Star, Zap, ArrowRight, Heart, Eye } from "lucide-react";
import Image from "next/image";

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
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden scroll-section">
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm">
            <Zap className="w-4 h-4 mr-2" />
            HOT PRODUCTS
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight">
            Sản phẩm nổi bật
          </h2>

          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : products.map((product, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                >
                  {/* Floating particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
                    <div className="absolute top-4 right-4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300" />
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-500" />
                  </div>

                  {/* Product Image */}
                  <div className="relative h-48 lg:h-56 xl:h-48 2xl:h-44 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      -{product.discount}%
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-2">
                      <button className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-slate-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 lg:p-5 xl:p-4 2xl:p-4">
                    <div className="flex items-center gap-1 mb-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-3 h-3 text-yellow-400">
                          <Star className="w-3 h-3" />
                        </div>
                      ))}
                    </div>
                    <div className="text-slate-300 text-xl font-semibold mb-1">
                      {product.name}
                    </div>
                    <div className="text-slate-300 text-sm">
                      {product.description}
                    </div>
                    <div className="text-slate-300 text-sm">
                      <span className="text-blue-400 font-semibold">
                        {product.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
            Xem tất cả sản phẩm
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
            <div className="text-slate-300">Sản phẩm có sẵn</div>
          </div>
          <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-slate-300">Hỗ trợ kỹ thuật</div>
          </div>
          <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              Miễn phí
            </div>
            <div className="text-slate-300">Vận chuyển toàn quốc</div>
          </div>
        </div>
      </div>
    </section>
  );
}
