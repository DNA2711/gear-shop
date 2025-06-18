"use client";

import { useEffect, useState } from "react";
import BrandLogo from "../../ui/BrandLogo";
import { ChevronLeft, ChevronRight, Zap, Shield, Award } from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface Brand {
  id: number;
  name: string;
  code: string;
  website: string;
  logo: string;
  imageFormat: string;
  fileSizeBytes: number;
}

export default function BrandSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const api = useApi();

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const result = await api.get("/api/brands/logos", {
          loadingMessage: "Đang tải thương hiệu..."
        });
        setBrands(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (brands.length === 0 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [brands.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + brands.length) % brands.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Get visible brands for carousel effect
  const getVisibleBrands = () => {
    if (brands.length === 0) return [];
    const visibleCount = 6;
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % brands.length;
      visible.push(brands[index]);
    }
    return visible;
  };

  if (loading) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-400/20">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">
                Thương Hiệu Hàng Đầu
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">
              Đối Tác Tin Cậy
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hợp tác cùng những thương hiệu linh kiện hàng đầu thế giới
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="relative group">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 animate-pulse">
                  <div className="flex flex-col items-center justify-center h-24">
                    <div className="w-16 h-8 bg-gray-600 rounded mb-3"></div>
                    <div className="w-12 h-3 bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-red-500/10 rounded-full border border-red-400/20">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Lỗi Tải Dữ Liệu</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Đối Tác Tin Cậy
          </h2>
          <div className="text-center text-red-400 bg-red-900/20 rounded-lg p-4 max-w-md mx-auto">
            Không thể tải danh sách thương hiệu: {error}
          </div>
        </div>
      </section>
    );
  }

  const visibleBrands = getVisibleBrands();

  return (
    <section
      className="relative overflow-hidden scroll-section"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${(i * 5.26) % 100}%`,
              top: `${(i * 3.74) % 100}%`,
              animationDelay: `${(i * 0.2) % 4}s`,
              animationDuration: `${2 + ((i * 0.2) % 4)}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-blue-500/10 rounded-full border border-blue-400/20 backdrop-blur-sm">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">
              Thương Hiệu Hàng Đầu
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6 leading-tight">
            Đối Tác Tin Cậy
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hợp tác cùng những thương hiệu linh kiện máy tính hàng đầu thế giới
          </p>

          {/* Tech Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="flex items-center gap-2 text-blue-400">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">
                {brands.length}+ Thương hiệu
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">100% Chính hãng</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Đối tác ủy quyền</span>
            </div>
          </div>
        </div>

        {/* Brand Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {brands.length > 6 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 group"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25 group"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Brand Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {visibleBrands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="relative group cursor-pointer"
                onClick={() =>
                  brand.website && window.open(brand.website, "_blank")
                }
              >
                {/* Hover Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-500 blur"></div>

                {/* Brand Card */}
                <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-gray-700/50 group-hover:border-blue-400/50 transition-all duration-500 group-hover:transform group-hover:scale-105 h-32 flex flex-col items-center justify-center">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {/* Brand Logo */}
                  <div className="relative z-10 mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    <BrandLogo
                      brandCode={brand.code}
                      brandName={brand.name}
                      base64Logo={brand.logo}
                      website={brand.website}
                      size="lg"
                      clickable={false}
                      fallback={true}
                      removeWhiteBackground={true}
                    />
                  </div>

                  {/* Brand Info */}
                  <div className="relative z-10 text-center">
                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 mt-1">
                      Chính hãng
                    </p>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {brands.length > 6 && (
            <div className="flex justify-center space-x-2 mt-12">
              {brands.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-blue-400 scale-125"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                ></button>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
            <span className="text-gray-300">Tất cả sản phẩm đều có</span>
            <span className="text-blue-400 font-semibold">
              bảo hành chính hãng
            </span>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
        </div>

        {brands.length === 0 && !loading && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/10 rounded-full border border-yellow-400/20">
              <span className="text-yellow-400">
                Không có thương hiệu nào để hiển thị
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
