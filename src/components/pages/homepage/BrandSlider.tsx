"use client";

import { useEffect, useState } from "react";

interface Brand {
  id: number;
  name: string;
  logo: string | null;
  description: string;
}

const brands: Brand[] = [
  {
    id: 1,
    name: "Apple",
    logo: null,
    description: "Vi điều khiển mã nguồn mở",
  },
  {
    id: 2,
    name: "Samsung",
    logo: null,
    description: "Máy tính nhúng",
  },
  {
    id: 3,
    name: "Sony",
    logo: null,
    description: "Linh kiện điện tử DIY",
  },
  {
    id: 4,
    name: "LG",
    logo: null,
    description: "Module điện tử",
  },
  {
    id: 5,
    name: "Xiaomi",
    logo: null,
    description: "WiFi & Bluetooth module",
  },
  {
    id: 6,
    name: "ASUS",
    logo: null,
    description: "Grove ecosystem",
  },
];

export default function BrandSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === brands.length - 4 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center border border-gray-200"
            >
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-500">Official Partner</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
