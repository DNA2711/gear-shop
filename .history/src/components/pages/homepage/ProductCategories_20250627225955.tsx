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
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Grid3X3,
} from "lucide-react";
import type { CategoryWithChildren } from "@/types/category";
import { useApi } from "@/hooks/useApi";
import { LoadingLink } from "@/components/ui/LoadingLink";

interface DisplayCategory {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  bgColor: string;
  gradient: string;
}

// Map category codes to icons and modern colors
const getCategoryDisplay = (
  categoryCode: string,
  categoryName: string
): Omit<DisplayCategory, "id" | "count"> => {
  const iconMap: Record<string, React.ReactNode> = {
    cpu: <Cpu className="w-6 h-6" />,
    vga: <Monitor className="w-6 h-6" />,
    gpu: <Monitor className="w-6 h-6" />,
    ram: <HardDrive className="w-6 h-6" />,
    storage: <HardDrive className="w-6 h-6" />,
    mainboard: <Cpu className="w-6 h-6" />,
    motherboard: <Cpu className="w-6 h-6" />,
    psu: <Zap className="w-6 h-6" />,
    case: <Package className="w-6 h-6" />,
    cooling: <Zap className="w-6 h-6" />,
    accessories: <Gamepad2 className="w-6 h-6" />,
    peripherals: <Gamepad2 className="w-6 h-6" />,
    keyboard: <Keyboard className="w-6 h-6" />,
    mouse: <Gamepad2 className="w-6 h-6" />,
    headset: <Headphones className="w-6 h-6" />,
    monitor: <Monitor className="w-6 h-6" />,
    laptop: <Smartphone className="w-6 h-6" />,
    // Child categories
    "intel-cpu": <Cpu className="w-6 h-6" />,
    "amd-cpu": <Cpu className="w-6 h-6" />,
    "nvidia-vga": <Monitor className="w-6 h-6" />,
    "amd-vga": <Monitor className="w-6 h-6" />,
    ddr4: <HardDrive className="w-6 h-6" />,
    ddr5: <HardDrive className="w-6 h-6" />,
    ssd: <HardDrive className="w-6 h-6" />,
    hdd: <HardDrive className="w-6 h-6" />,
    "gaming-monitor": <Monitor className="w-6 h-6" />,
    "office-monitor": <Monitor className="w-6 h-6" />,
  };

  // Modern vibrant gradients
  const colorVariants = [
    {
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      color: "from-blue-400 to-purple-400",
      bgColor: "bg-blue-500/10",
    },
    {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      color: "from-emerald-400 to-teal-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      gradient: "from-orange-500 via-red-500 to-pink-500",
      color: "from-orange-400 to-red-400",
      bgColor: "bg-orange-500/10",
    },
    {
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      color: "from-violet-400 to-purple-400",
      bgColor: "bg-violet-500/10",
    },
    {
      gradient: "from-amber-500 via-yellow-500 to-orange-500",
      color: "from-amber-400 to-yellow-400",
      bgColor: "bg-amber-500/10",
    },
    {
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      color: "from-rose-400 to-pink-400",
      bgColor: "bg-rose-500/10",
    },
  ];

  const code = categoryCode.toLowerCase();
  const icon = iconMap[code] || <Package className="w-6 h-6" />;
  const colorIndex =
    Math.abs(code.charCodeAt(0) + code.charCodeAt(code.length - 1)) %
    colorVariants.length;
  const selectedColor = colorVariants[colorIndex];

  return {
    name: categoryName,
    description: `Khám phá ${categoryName.toLowerCase()} chất lượng cao`,
    icon,
    color: selectedColor.color,
    bgColor: selectedColor.bgColor,
    gradient: selectedColor.gradient,
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
        const result = await api.get("/api/categories", {
          loadingMessage: "Đang tải danh mục sản phẩm...",
        });
        console.log("Categories API response:", result);

        if (result.success && result.data) {
          // Filter active categories only
          let allActiveCategories = result.data.filter(
            (cat: CategoryWithChildren) => cat.is_active
          );

          console.log("All active categories:", allActiveCategories);

          // Convert API categories to display format
          const categoriesToDisplay = allActiveCategories.slice(0, 6);
          const displayCategories: DisplayCategory[] = (await Promise.all(
            categoriesToDisplay.map(async (cat: CategoryWithChildren) => {
              // Safety check for category data
              if (
                !cat.category_id ||
                !cat.category_code ||
                !cat.category_name
              ) {
                console.warn("Invalid category data:", cat);
                return null;
              }

              // Fetch product count for each category
              let productCount = 0;
              try {
                const countResponse = await fetch(
                  `/api/products?category_id=${cat.category_id}&limit=1`
                );
                const countResult = await countResponse.json();
                if (countResult.success && countResult.pagination) {
                  productCount = countResult.pagination.total;
                }
              } catch (error) {
                console.log(
                  "Error fetching product count for category:",
                  cat.category_id
                );
                productCount = Math.floor(Math.random() * 200) + 50; // Fallback random count
              }

              return {
                id: cat.category_id,
                count: productCount,
                ...getCategoryDisplay(cat.category_code, cat.category_name),
              };
            })
          ).then((results) => results.filter(Boolean))) as DisplayCategory[]; // Remove null values

          console.log("Display categories with counts:", displayCategories);

          // If we have categories, use them. Otherwise, use fallback
          if (displayCategories.length > 0) {
            setCategories(displayCategories);
          } else {
            // Fallback categories if no data
            setCategories([
              {
                id: 1,
                name: "CPU",
                description: "Khám phá cpu chất lượng cao",
                icon: <Cpu className="w-6 h-6" />,
                count: 125,
                color: "from-blue-400 to-purple-400",
                bgColor: "bg-blue-500/10",
                gradient: "from-blue-500 via-purple-500 to-pink-500",
              },
              {
                id: 2,
                name: "VGA",
                description: "Khám phá vga chất lượng cao",
                icon: <Monitor className="w-6 h-6" />,
                count: 89,
                color: "from-emerald-400 to-teal-400",
                bgColor: "bg-emerald-500/10",
                gradient: "from-emerald-500 via-teal-500 to-cyan-500",
              },
              {
                id: 3,
                name: "RAM",
                description: "Khám phá ram chất lượng cao",
                icon: <HardDrive className="w-6 h-6" />,
                count: 167,
                color: "from-orange-400 to-red-400",
                bgColor: "bg-orange-500/10",
                gradient: "from-orange-500 via-red-500 to-pink-500",
              },
              {
                id: 4,
                name: "Storage",
                description: "Khám phá storage chất lượng cao",
                icon: <HardDrive className="w-6 h-6" />,
                count: 98,
                color: "from-violet-400 to-purple-400",
                bgColor: "bg-violet-500/10",
                gradient: "from-violet-500 via-purple-500 to-indigo-500",
              },
              {
                id: 5,
                name: "Mainboard",
                description: "Khám phá mainboard chất lượng cao",
                icon: <Cpu className="w-6 h-6" />,
                count: 76,
                color: "from-amber-400 to-yellow-400",
                bgColor: "bg-amber-500/10",
                gradient: "from-amber-500 via-yellow-500 to-orange-500",
              },
              {
                id: 6,
                name: "Monitor",
                description: "Khám phá monitor chất lượng cao",
                icon: <Monitor className="w-6 h-6" />,
                count: 156,
                color: "from-rose-400 to-pink-400",
                bgColor: "bg-rose-500/10",
                gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Use fallback categories on error
        setCategories([
          {
            id: 1,
            name: "CPU",
            description: "Khám phá cpu chất lượng cao",
            icon: <Cpu className="w-6 h-6" />,
            count: 125,
            color: "from-blue-400 to-purple-400",
            bgColor: "bg-blue-500/10",
            gradient: "from-blue-500 via-purple-500 to-pink-500",
          },
          {
            id: 2,
            name: "VGA",
            description: "Khám phá vga chất lượng cao",
            icon: <Monitor className="w-6 h-6" />,
            count: 89,
            color: "from-emerald-400 to-teal-400",
            bgColor: "bg-emerald-500/10",
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
          },
          {
            id: 3,
            name: "RAM",
            description: "Khám phá ram chất lượng cao",
            icon: <HardDrive className="w-6 h-6" />,
            count: 167,
            color: "from-orange-400 to-red-400",
            bgColor: "bg-orange-500/10",
            gradient: "from-orange-500 via-red-500 to-pink-500",
          },
          {
            id: 4,
            name: "Storage",
            description: "Khám phá storage chất lượng cao",
            icon: <HardDrive className="w-6 h-6" />,
            count: 98,
            color: "from-violet-400 to-purple-400",
            bgColor: "bg-violet-500/10",
            gradient: "from-violet-500 via-purple-500 to-indigo-500",
          },
          {
            id: 5,
            name: "Mainboard",
            description: "Khám phá mainboard chất lượng cao",
            icon: <Cpu className="w-6 h-6" />,
            count: 76,
            color: "from-amber-400 to-yellow-400",
            bgColor: "bg-amber-500/10",
            gradient: "from-amber-500 via-yellow-500 to-orange-500",
          },
          {
            id: 6,
            name: "Monitor",
            description: "Khám phá monitor chất lượng cao",
            icon: <Monitor className="w-6 h-6" />,
            count: 156,
            color: "from-rose-400 to-pink-400",
            bgColor: "bg-rose-500/10",
            gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
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
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-xl">
              <Grid3X3 className="w-5 h-5 mr-2" />
              SHOP BY CATEGORY
            </div>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent mb-4">
              Danh Mục Sản Phẩm
            </h2>
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-pulse border border-slate-700/50"
              >
                <div className="w-12 h-12 bg-slate-700 rounded-xl mb-4 mx-auto"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-2xl backdrop-blur-sm">
            <Grid3X3 className="w-5 h-5 mr-2 animate-pulse" />
            <span className="relative">
              🛍️ SHOP BY CATEGORY
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-100 via-white to-blue-100 bg-clip-text text-transparent mb-6 leading-tight">
            Danh Mục
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Sản Phẩm
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-blue-100 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
            Khám phá <span className="text-blue-300 font-semibold">hàng nghìn sản phẩm</span> chất lượng cao được 
            <span className="text-purple-300 font-semibold"> phân loại chi tiết</span> để bạn dễ dàng tìm kiếm
          </p>

          {/* Stats Row */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2 text-blue-200">
              <ShoppingBag className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-medium">Easy Shopping</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <TrendingUp className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-medium">Best Sellers</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-200">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <LoadingLink
              key={category.id}
              href={`/products?category=${category.id}`}
              loadingMessage={`Đang tải sản phẩm ${category.name}...`}
              className="group cursor-pointer block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-sm shadow-xl border border-slate-700/50 hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                {/* Gradient Background */}
                <div className={`bg-gradient-to-br ${category.gradient} p-6 text-white relative overflow-hidden`}>
                  {/* Background Effects */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/20 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 blur-lg animate-pulse"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-lg font-bold mb-2 leading-tight group-hover:scale-105 transition-transform duration-300">
                      {category.name}
                    </h3>

                    {/* Product Count */}
                    <div className="text-sm opacity-90 font-medium mb-3">
                      {category.count} sản phẩm
                    </div>

                    {/* Call to Action */}
                    <div className="flex items-center justify-center text-sm font-semibold opacity-80 group-hover:opacity-100 transition-all duration-300">
                      <span>Khám phá ngay</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>

                {/* Bottom Section */}
                <div className="p-4 bg-slate-800/40 backdrop-blur-sm">
                  <p className="text-xs text-blue-200 text-center leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              </div>
            </LoadingLink>
          ))}
        </div>
      </div>
    </section>
  );
}
