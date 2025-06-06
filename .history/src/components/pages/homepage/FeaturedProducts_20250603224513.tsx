"use client";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Arduino Uno R3",
    price: 299000,
    originalPrice: 350000,
    image: "/api/placeholder/250/250",
    category: "Microcontroller",
    rating: 4.8,
    reviews: 245,
  },
  {
    id: 2,
    name: "Raspberry Pi 4 Model B",
    price: 1200000,
    image: "/api/placeholder/250/250",
    category: "Single Board Computer",
    rating: 4.9,
    reviews: 189,
  },
  {
    id: 3,
    name: "DHT22 Temperature Sensor",
    price: 85000,
    originalPrice: 120000,
    image: "/api/placeholder/250/250",
    category: "Sensor",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "ESP32 Development Board",
    price: 199000,
    image: "/api/placeholder/250/250",
    category: "WiFi Module",
    rating: 4.8,
    reviews: 203,
  },
];

export default function FeaturedProducts() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-gray-600 text-lg">
            Những sản phẩm được yêu thích nhất tại cửa hàng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                    Sale
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="text-sm text-blue-600 mb-1">
                  {product.category}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-1">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Xem Tất Cả Sản Phẩm
          </button>
        </div>
      </div>
    </section>
  );
}
