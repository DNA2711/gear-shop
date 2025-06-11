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
    icon: <Cpu className="w-8 h-8" />,
    count: 125,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    name: "VGA & Graphics Card",
    description: "RTX 5090, RTX 4080, RX 7900 XTX",
    icon: <Monitor className="w-8 h-8" />,
    count: 89,
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    id: 3,
    name: "RAM & Memory",
    description: "DDR5, DDR4, Kingston, Corsair",
    icon: <HardDrive className="w-8 h-8" />,
    count: 167,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 4,
    name: "Gaming Peripherals",
    description: "Chuột, bàn phím, tai nghe gaming",
    icon: <Gamepad2 className="w-8 h-8" />,
    count: 245,
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-500/10",
  },
  {
    id: 5,
    name: "Power & Cooling",
    description: "PSU, AIO, tản nhiệt, case fan",
    icon: <Zap className="w-8 h-8" />,
    count: 178,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: 6,
    name: "Gaming Setup",
    description: "Case, màn hình, bàn ghế gaming",
    icon: <Keyboard className="w-8 h-8" />,
    count: 156,
    color: "from-cyan-400 to-cyan-600",
    bgColor: "bg-cyan-500/10",
  },
];

export default function ProductCategories() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden scroll-section">
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg backdrop-blur-sm">
            <Star className="w-4 h-4 mr-2" />
            SHOP BY CATEGORY
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 leading-tight">
            Danh Mục Sản Phẩm
          </h2>

          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Khám phá các danh mục linh kiện máy tính gaming và workstation hàng
            đầu
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group relative bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 lg:p-6 xl:p-4 2xl:p-5 text-center hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
            >
              {/* Floating particles */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping" />
                <div className="absolute top-2 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-200" />
                <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-400" />
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              {/* Icon */}
              <div className="relative z-10 mb-3 lg:mb-4">
                <category.icon className="w-8 h-8 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 mx-auto text-blue-400 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <h3 className="text-sm lg:text-base xl:text-sm 2xl:text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                {category.name}
              </h3>

              {/* Product count */}
              <p className="text-xs lg:text-sm xl:text-xs 2xl:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {category.count} sản phẩm
              </p>

              {/* Progress indicator */}
              <div className="mt-3 w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                  style={{ width: `${Math.min(100, (category.count / 50) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-slate-300 font-medium">Sản phẩm có sẵn</div>
            </div>

            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-slate-300 font-medium">Hỗ trợ kỹ thuật</div>
            </div>

            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                Free
              </div>
              <div className="text-slate-300 font-medium">Vận chuyển nhanh</div>
            </div>

            <div className="text-center group">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                5★
              </div>
              <div className="text-slate-300 font-medium">
                Đánh giá khách hàng
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
