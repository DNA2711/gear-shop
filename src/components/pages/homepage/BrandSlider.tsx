"use client";

import { useEffect, useState } from "react";
import BrandLogo from "../../ui/BrandLogo";

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
    if (brands.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === brands.length - 4 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [brands.length]);

  if (loading) {
    return (
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
