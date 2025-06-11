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
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 transform group-hover:-translate-y-3 group-hover:scale-105">
                {/* Gradient Background */}
                <div
                  className={`bg-gradient-to-br ${category.color} p-8 text-white relative overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 blur-xl"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        {category.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-sm opacity-80 font-medium">
                          Sản phẩm
                        </div>
                        <div className="text-3xl font-bold">
                          {category.count}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{category.name}</h3>
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm font-semibold">
                        <span>Khám phá ngay</span>
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                      </div>

                      {/* Progress indicator */}
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-white/50 rounded-full group-hover:bg-white/80 transition-colors duration-300"
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
