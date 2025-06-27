"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ChevronLeft, ChevronRight, Zap, Shield, Award } from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface Brand {
  id: number;
  name: string;
  logo_url: string;
}

export default function BrandSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands/logos");
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
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
      <section className="scroll-section bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Thương hiệu nổi bật
          </h2>
          <div className="overflow-hidden">
            <div className="flex space-x-8 animate-pulse">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-32 h-20 bg-white/10 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="scroll-section bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Thương hiệu nổi bật
        </h2>
        
        <div className="overflow-hidden">
          <div className="flex space-x-8 animate-scroll-left">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 w-32 h-20 bg-white/95 rounded-lg shadow-md flex items-center justify-center p-3"
              >
                <BrandLogo
                  src={brand.logo_url}
                  alt={brand.name}
                  width={100}
                  height={60}
                  removeWhiteBackground={true}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
