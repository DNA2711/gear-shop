"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  HardDrive,
  Monitor,
  Keyboard,
  Zap,
  Gamepad2,
  ArrowRight,
  Star,
  Smartphone,
  Headphones,
  Package,
} from "lucide-react";
import type { CategoryWithChildren } from "@/types/category";
import { useApi } from "@/hooks/useApi";

interface DisplayCategory {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  bgColor: string;
}

// Map category codes to icons and colors
const getCategoryDisplay = (
  categoryCode: string,
  categoryName: string
): Omit<DisplayCategory, "id" | "count"> => {
  const iconMap: Record<string, React.ReactNode> = {
    cpu: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
    vga: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
    gpu: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
    ram: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
    storage: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
    mainboard: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
    motherboard: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
    psu: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
    case: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
    cooling: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
    accessories: <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />,
    peripherals: <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />,
    keyboard: <Keyboard className="w-4 h-4 sm:w-5 sm:h-5" />,
    mouse: <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />,
    headset: <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />,
    monitor: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
    laptop: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />,
    // Child categories
    "intel-cpu": <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
    "amd-cpu": <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
    "nvidia-vga": <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
    "amd-vga": <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
    ddr4: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
    ddr5: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
    ssd: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
    hdd: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
    "gaming-monitor": <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
    "office-monitor": <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
  };

  // Harmonious colors that match the page theme (slate/blue gradient)
  const colorVariants = [
    "from-slate-400 to-slate-600",
    "from-blue-400 to-blue-600",
    "from-slate-500 to-blue-500",
    "from-blue-300 to-slate-500",
    "from-slate-300 to-blue-400",
    "from-blue-500 to-slate-600",
  ];

  const code = categoryCode.toLowerCase();
  const icon = iconMap[code] || <Package className="w-4 h-4 sm:w-5 sm:h-5" />;
  const colorIndex =
    Math.abs(code.charCodeAt(0) + code.charCodeAt(code.length - 1)) %
    colorVariants.length;

  return {
    name: categoryName,
    description: `Sản phẩm ${categoryName.toLowerCase()}`,
    icon,
    color: colorVariants[colorIndex],
    bgColor: "bg-slate-500/10",
  };
};

export default function ProductCategories() {
  const [categories, setCategories] = useState<DisplayCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const result = await response.json();
        console.log("Categories API response:", result);

        if (result.success && result.data) {
          // Filter active categories only
          let allActiveCategories = result.data.filter(
            (cat: CategoryWithChildren) => cat.is_active
          );

          console.log("All active categories:", allActiveCategories);

          // Convert API categories to display format
          const categoriesToDisplay = allActiveCategories.slice(0, 6);
          const displayCategories: DisplayCategory[] = categoriesToDisplay.map(
            (cat: CategoryWithChildren) => ({
              id: cat.category_id,
              count: cat.product_count || Math.floor(Math.random() * 200) + 50,
              ...getCategoryDisplay(cat.category_code, cat.category_name),
            })
          );

          console.log("Display categories:", displayCategories);

          // If we have categories, use them. Otherwise, use fallback
          if (displayCategories.length > 0) {
            setCategories(displayCategories);
          } else {
            // Fallback categories if no data
            setCategories([
              {
                id: 1,
                name: "CPU",
                description: "Bộ vi xử lý",
                icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
                count: 125,
                color: "from-slate-400 to-slate-600",
                bgColor: "bg-slate-500/10",
              },
              {
                id: 2,
                name: "VGA",
                description: "Card đồ họa",
                icon: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
                count: 89,
                color: "from-blue-400 to-blue-600",
                bgColor: "bg-blue-500/10",
              },
              {
                id: 3,
                name: "RAM",
                description: "Bộ nhớ",
                icon: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
                count: 167,
                color: "from-slate-500 to-blue-500",
                bgColor: "bg-slate-500/10",
              },
              {
                id: 4,
                name: "Storage",
                description: "Ổ cứng",
                icon: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
                count: 98,
                color: "from-blue-300 to-slate-500",
                bgColor: "bg-blue-500/10",
              },
              {
                id: 5,
                name: "Mainboard",
                description: "Bo mạch chủ",
                icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
                count: 76,
                color: "from-slate-300 to-blue-400",
                bgColor: "bg-slate-500/10",
              },
              {
                id: 6,
                name: "Monitor",
                description: "Màn hình",
                icon: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
                count: 156,
                color: "from-blue-500 to-slate-600",
                bgColor: "bg-blue-500/10",
              },
            ]);
            console.log("Using fallback categories");
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Use fallback on error too
        setCategories([
          {
            id: 1,
            name: "CPU",
            description: "Bộ vi xử lý",
            icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
            count: 125,
            color: "from-slate-400 to-slate-600",
            bgColor: "bg-slate-500/10",
          },
          {
            id: 2,
            name: "VGA",
            description: "Card đồ họa",
            icon: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
            count: 89,
            color: "from-blue-400 to-blue-600",
            bgColor: "bg-blue-500/10",
          },
          {
            id: 3,
            name: "RAM",
            description: "Bộ nhớ",
            icon: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
            count: 167,
            color: "from-slate-500 to-blue-500",
            bgColor: "bg-slate-500/10",
          },
          {
            id: 4,
            name: "Storage",
            description: "Ổ cứng",
            icon: <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />,
            count: 98,
            color: "from-blue-300 to-slate-500",
            bgColor: "bg-blue-500/10",
          },
          {
            id: 5,
            name: "Mainboard",
            description: "Bo mạch chủ",
            icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
            count: 76,
            color: "from-slate-300 to-blue-400",
            bgColor: "bg-slate-500/10",
          },
          {
            id: 6,
            name: "Monitor",
            description: "Màn hình",
            icon: <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />,
            count: 156,
            color: "from-blue-500 to-slate-600",
            bgColor: "bg-blue-500/10",
          },
        ]);
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden scroll-section">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-slate-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              SHOP BY CATEGORY
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
              Danh Mục Sản Phẩm
            </h2>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/30 rounded-lg p-3 sm:p-4 animate-pulse"
              >
                <div className="w-8 h-8 bg-slate-700 rounded-lg mb-2"></div>
                <div className="h-4 bg-slate-700 rounded mb-1"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden scroll-section">
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
        {/* Header - Compact */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-slate-600 to-blue-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-lg backdrop-blur-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            SHOP BY CATEGORY
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-300 via-blue-300 to-slate-400 bg-clip-text text-transparent mb-4 leading-tight">
            Danh Mục Sản Phẩm
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-4">
            Khám phá các danh mục linh kiện máy tính
          </p>
        </div>

        {/* Categories Grid - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-lg bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 hover:border-slate-500/50 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-105">
                {/* Gradient Background */}
                <div
                  className={`bg-gradient-to-br ${category.color} p-3 sm:p-4 text-white relative overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-white/20 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-white/10 blur-lg"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                        {category.icon}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-xs opacity-80 font-medium">
                        {category.count} sản phẩm
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold mb-1 leading-tight">
                      {category.name}
                    </h3>

                    <div className="flex items-center justify-center text-xs font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>Xem thêm</span>
                      <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats - Compact */}
        <div className="mt-8 sm:mt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-slate-800/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-slate-700/30">
            <div className="text-center group">
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-300 to-blue-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-slate-400 font-medium text-xs">Sản phẩm</div>
            </div>

            <div className="text-center group">
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-300 to-slate-400 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-slate-400 font-medium text-xs">Hỗ trợ</div>
            </div>

            <div className="text-center group">
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-400 to-blue-300 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                Free
              </div>
              <div className="text-slate-400 font-medium text-xs">
                Vận chuyển
              </div>
            </div>

            <div className="text-center group">
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                5★
              </div>
              <div className="text-slate-400 font-medium text-xs">Đánh giá</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
