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
    name: "Seeed Studio",
    logo: "/api/placeholder/120/60",
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
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Thương Hiệu Đối Tác
          </h2>
          <p className="text-gray-600 text-lg">
            Chúng tôi hợp tác với các thương hiệu hàng đầu thế giới
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 4)}%)`,
              width: `${brands.length * 25}%`,
            }}
          >
            {brands.map((brand) => (
              <div key={brand.id} className="w-1/4 flex-shrink-0 px-4">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="mx-auto mb-4 h-12 object-contain"
                  />
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-600">{brand.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: brands.length - 3 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Sản phẩm chính hãng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Thương hiệu đối tác</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
