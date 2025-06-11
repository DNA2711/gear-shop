"use client";

import {
  Cpu,
  HardDrive,
  Monitor,
  Keyboard,
  Zap,
  Gamepad2,
  ArrowRight,
  Star,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "CPU & Processor",
    description: "Intel, AMD, Core Ultra, Ryzen series",
    icon: <Cpu className="w-6 h-6" />,
    count: 125,
    color: "from-slate-600 to-slate-800",
    bgColor: "bg-slate-500/10",
  },
  {
    id: 2,
    name: "VGA & Graphics Card",
    description: "RTX 5090, RTX 4080, RX 7900 XTX",
    icon: <Monitor className="w-6 h-6" />,
    count: 89,
    color: "from-blue-600 to-blue-800",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    name: "RAM & Memory",
    description: "DDR5, DDR4, Kingston, Corsair",
    icon: <HardDrive className="w-6 h-6" />,
    count: 167,
    color: "from-indigo-600 to-indigo-800",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: 4,
    name: "Gaming Peripherals",
    description: "Chuột, bàn phím, tai nghe gaming",
    icon: <Gamepad2 className="w-6 h-6" />,
    count: 245,
    color: "from-purple-600 to-purple-800",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 5,
    name: "Power & Cooling",
    description: "PSU, AIO, tản nhiệt, case fan",
    icon: <Zap className="w-6 h-6" />,
    count: 178,
    color: "from-cyan-600 to-cyan-800",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: 6,
    name: "Gaming Setup",
    description: "Case, màn hình, bàn ghế gaming",
    icon: <Keyboard className="w-6 h-6" />,
    count: 156,
    color: "from-teal-600 to-teal-800",
    bgColor: "bg-teal-500/10",
  },
];

export default function ProductCategories() {
  return (
    <section className="py-12 relative overflow-hidden scroll-section">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-lg backdrop-blur-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            SHOP BY CATEGORY
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight">
            Danh Mục Sản Phẩm
          </h2>

          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Khám phá các danh mục linh kiện máy tính gaming và workstation hàng
            đầu
          </p>
        </div>

        {/* Categories Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-105">
                {/* Gradient Background */}
                <div
                  className={`bg-gradient-to-br ${category.color} p-4 sm:p-6 text-white relative overflow-hidden min-h-[180px] sm:min-h-[200px]`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-white/5 blur-lg"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                        {category.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-80 font-medium">
                          Sản phẩm
                        </div>
                        <div className="text-lg sm:text-xl font-bold">
                          {category.count}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base font-bold mb-2 leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs sm:text-sm font-semibold">
                        <span>Xem thêm</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>

                      {/* Progress indicator */}
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-white/50 rounded-full group-hover:bg-white/80 transition-colors duration-300"
                            style={{ transitionDelay: `${i * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats - Responsive */}
        <div className="mt-12 sm:mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 bg-slate-800/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-700/50">
            <div className="text-center group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-slate-300 font-medium text-xs sm:text-sm">
                Sản phẩm có sẵn
              </div>
            </div>

            <div className="text-center group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-slate-300 font-medium text-xs sm:text-sm">
                Hỗ trợ kỹ thuật
              </div>
            </div>

            <div className="text-center group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                Free
              </div>
              <div className="text-slate-300 font-medium text-xs sm:text-sm">
                Vận chuyển nhanh
              </div>
            </div>

            <div className="text-center group">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                5★
              </div>
              <div className="text-slate-300 font-medium text-xs sm:text-sm">
                Đánh giá khách hàng
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
