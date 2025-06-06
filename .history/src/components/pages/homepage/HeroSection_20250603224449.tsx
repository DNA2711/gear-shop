"use client";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Linh Kiện Điện Tử
              <span className="block text-yellow-400">Chất Lượng Cao</span>
            </h1>
            <p className="text-xl text-gray-200">
              Cung cấp các linh kiện điện tử, Arduino, Raspberry Pi, sensors và nhiều hơn nữa với giá tốt nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors">
                Xem Sản Phẩm
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                Hướng Dẫn
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative">
              <img 
                src="/api/placeholder/500/400" 
                alt="Electronic Components" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold">
                Miễn Phí Ship
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 