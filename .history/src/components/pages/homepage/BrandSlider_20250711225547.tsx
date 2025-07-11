"use client";

import { useEffect, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";

interface Brand {
  id: number;
  name: string;
  code: string;
  logo: string;
}

export default function BrandSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands/logos");
        if (response.ok) {
          const result = await response.json();
          setBrands(Array.isArray(result.data) ? result.data : []);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="scroll-section bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-8 sm:mb-12">
            Thương hiệu nổi bật
          </h2>
          
          {/* Mobile Grid Skeleton */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-white/10 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Desktop Slider Skeleton */}
          <div className="hidden sm:block overflow-hidden">
            <div className="flex space-x-6 lg:space-x-8 animate-pulse">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-24 h-16 sm:w-32 sm:h-20 lg:w-36 lg:h-24 bg-white/10 rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="scroll-section bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-lg backdrop-blur-sm">
            <span className="mr-2">🏆</span>
            THƯƠNG HIỆU UY TÍN
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-4">
            Thương hiệu nổi bật
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Đối tác chính thức của những thương hiệu hàng đầu thế giới
          </p>
        </div>

        {/* Mobile Grid Layout */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {brands.slice(0, 6).map((brand) => (
              <div
                key={brand.id}
                className="bg-white/95 rounded-xl shadow-lg p-4 flex items-center justify-center min-h-[80px] hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <BrandLogo
                  brandCode={brand.code}
                  brandName={brand.name}
                  base64Logo={brand.logo}
                  size="md"
                  clickable={false}
                  fallback={true}
                  removeWhiteBackground={true}
                  className="max-w-full max-h-full"
                />
              </div>
            ))}
          </div>
          
          {brands.length > 6 && (
            <div className="text-center">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300">
                Xem thêm {brands.length - 6} thương hiệu khác
              </button>
            </div>
          )}
        </div>

        {/* Desktop Slider Layout */}
        <div className="hidden sm:block overflow-hidden">
          <div className="flex space-x-6 lg:space-x-8 animate-scroll-left">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 group"
              >
                <div className="w-24 h-16 sm:w-32 sm:h-20 lg:w-36 lg:h-24 bg-white/95 rounded-xl shadow-lg flex items-center justify-center p-3 lg:p-4 hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white">
                  <BrandLogo
                    brandCode={brand.code}
                    brandName={brand.name}
                    base64Logo={brand.logo}
                    size="lg"
                    clickable={false}
                    fallback={true}
                    removeWhiteBackground={true}
                    className="max-w-full max-h-full transition-all duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">15+</div>
              <div className="text-slate-300 text-sm sm:text-base">Thương hiệu đối tác</div>
            </div>
            
            <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-slate-300 text-sm sm:text-base">Hàng chính hãng</div>
            </div>
            
            <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">3 năm</div>
              <div className="text-slate-300 text-sm sm:text-base">Bảo hành tối thiểu</div>
            </div>
            
            <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700/50">
              <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-slate-300 text-sm sm:text-base">Hỗ trợ kỹ thuật</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
