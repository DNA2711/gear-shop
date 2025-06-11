"use client";

import { useEffect, useState } from "react";
import BrandLogo from "../../ui/BrandLogo";
import { ChevronLeft, ChevronRight, Zap, Shield, Award } from "lucide-react";

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

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/brands/logos");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const result = await response.json();
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
    setCurrentIndex((prevIndex) => (prevIndex - 1 + brands.length) % brands.length);
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
              <span className="text-blue-400 font-medium">Thương Hiệu Hàng Đầu</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-4">
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Thương Hiệu Đối Tác
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse"
              >
                <div className="text-center">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Thương Hiệu Đối Tác
          </h2>
          <div className="text-center text-red-500">
            Lỗi khi tải thương hiệu: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Thương Hiệu Đối Tác
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center border border-gray-200 group"
            >
              {/* Brand Logo */}
              <div className="mb-3">
                <BrandLogo
                  brandCode={brand.code}
                  brandName={brand.name}
                  base64Logo={brand.logo}
                  website={brand.website}
                  size="lg"
                  clickable={true}
                  fallback={true}
                />
              </div>

              {/* Brand Info */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-gray-500">Official Partner</p>
              </div>
            </div>
          ))}
        </div>

        {brands.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            Không có thương hiệu nào để hiển thị
          </div>
        )}
      </div>
    </section>
  );
}
