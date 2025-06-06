import React from "react";
import Header from "@/components/layout/header";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

const mockProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    price: 34990000,
    salePrice: 29990000,
    image: "/products/iphone-15-pro-max.jpg",
    brand: "Apple",
    sku: "IP15PM256",
  },
  {
    id: 2,
    name: 'MacBook Air M2 13" 256GB',
    price: 27990000,
    image: "/products/macbook-air-m2.jpg",
    brand: "Apple",
    sku: "MBA13M2256",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra 512GB",
    price: 32990000,
    salePrice: 28990000,
    image: "/products/galaxy-s24-ultra.jpg",
    brand: "Samsung",
    sku: "SGS24U512",
  },
  {
    id: 4,
    name: "AirPods Pro (2nd generation)",
    price: 6990000,
    salePrice: 5990000,
    image: "/products/airpods-pro.jpg",
    brand: "Apple",
    sku: "APP2GEN",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chào mừng đến với Gear Shop
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Khám phá những thiết bị công nghệ hàng đầu với giá tốt nhất
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Khám phá ngay
            </button>
          </div>
        </div>

        {/* Products Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Sản phẩm nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    Product Image
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">
                    {product.brand} • {product.sku}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.salePrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <AddToCartButton
                    product={product}
                    className="w-full"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Miễn phí vận chuyển</h3>
            <p className="text-gray-600">
              Giao hàng miễn phí cho đơn hàng trên 500.000đ
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Bảo hành chính hãng</h3>
            <p className="text-gray-600">Bảo hành chính hãng từ nhà sản xuất</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">Hỗ trợ khách hàng 24/7 qua hotline</p>
          </div>
        </section>
      </main>
    </div>
  );
}
