"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Monitor,
  Laptop,
  Smartphone,
  Cpu,
  HardDrive,
  Gamepad2,
  ChevronRight,
  Grid3X3,
  Zap,
  CircuitBoard,
  Camera,
  Speaker,
  ArrowRight,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingLink } from "@/components/ui/LoadingLink";

interface CategoryItem {
  category_id: number;
  category_name: string;
  category_code: string;
  product_count?: number;
  children?: CategoryItem[];
}

export default function HeaderDropdownMenu() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?hierarchy=true");
      const result = await response.json();
      if (result.success) {
        // Lấy top 8 categories chính và limit subcategories
        const topCategories = result.data
          .filter((cat: CategoryItem) => cat.category_id)
          .slice(0, 8)
          .map((cat: CategoryItem) => ({
            ...cat,
            children: cat.children?.slice(0, 6) || [], // Increase to 6 subcategories
          }));
        setCategories(topCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Enhanced fallback data
      setCategories([
        {
          category_id: 1,
          category_name: "CPU",
          category_code: "cpu",
          product_count: 125,
          children: [
            {
              category_id: 11,
              category_name: "Intel Core i9",
              category_code: "intel-cpu",
            },
            {
              category_id: 12,
              category_name: "AMD Ryzen",
              category_code: "amd-cpu",
            },
            {
              category_id: 13,
              category_name: "Intel Core i7",
              category_code: "intel-i7",
            },
            {
              category_id: 14,
              category_name: "AMD Threadripper",
              category_code: "amd-threadripper",
            },
          ],
        },
        {
          category_id: 2,
          category_name: "VGA",
          category_code: "vga",
          product_count: 89,
          children: [
            {
              category_id: 21,
              category_name: "NVIDIA RTX 40",
              category_code: "nvidia-vga",
            },
            {
              category_id: 22,
              category_name: "AMD RX 7000",
              category_code: "amd-vga",
            },
            {
              category_id: 23,
              category_name: "NVIDIA RTX 30",
              category_code: "nvidia-rtx30",
            },
            {
              category_id: 24,
              category_name: "Gaming GPU",
              category_code: "gaming-gpu",
            },
          ],
        },
        {
          category_id: 3,
          category_name: "RAM",
          category_code: "ram",
          product_count: 167,
          children: [
            {
              category_id: 31,
              category_name: "DDR5",
              category_code: "ddr5",
            },
            {
              category_id: 32,
              category_name: "DDR4",
              category_code: "ddr4",
            },
            {
              category_id: 33,
              category_name: "Gaming RAM",
              category_code: "gaming-ram",
            },
          ],
        },
        {
          category_id: 4,
          category_name: "Storage",
          category_code: "storage",
          product_count: 98,
          children: [
            {
              category_id: 41,
              category_name: "SSD NVMe",
              category_code: "ssd-nvme",
            },
            {
              category_id: 42,
              category_name: "SSD SATA",
              category_code: "ssd-sata",
            },
            {
              category_id: 43,
              category_name: "HDD",
              category_code: "hdd",
            },
          ],
        },
        {
          category_id: 5,
          category_name: "Mainboard",
          category_code: "mainboard",
          product_count: 76,
          children: [
            {
              category_id: 51,
              category_name: "Intel Socket",
              category_code: "intel-mb",
            },
            {
              category_id: 52,
              category_name: "AMD Socket",
              category_code: "amd-mb",
            },
          ],
        },
        {
          category_id: 6,
          category_name: "Monitor",
          category_code: "monitor",
          product_count: 156,
          children: [
            {
              category_id: 61,
              category_name: "Gaming Monitor",
              category_code: "gaming-monitor",
            },
            {
              category_id: 62,
              category_name: "4K Monitor",
              category_code: "4k-monitor",
            },
          ],
        },
        {
          category_id: 7,
          category_name: "Cooling",
          category_code: "cooling",
          product_count: 43,
          children: [
            {
              category_id: 71,
              category_name: "AIO Cooler",
              category_code: "aio-cooler",
            },
            {
              category_id: 72,
              category_name: "Air Cooler",
              category_code: "air-cooler",
            },
          ],
        },
        {
          category_id: 8,
          category_name: "Gaming Gear",
          category_code: "gaming",
          product_count: 89,
          children: [
            {
              category_id: 81,
              category_name: "Gaming Chair",
              category_code: "gaming-chair",
            },
            {
              category_id: 82,
              category_name: "Gaming Mouse",
              category_code: "gaming-mouse",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryCode: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      cpu: <Cpu className="w-5 h-5" />,
      vga: <Zap className="w-5 h-5" />,
      ram: <HardDrive className="w-5 h-5" />,
      storage: <HardDrive className="w-5 h-5" />,
      mainboard: <CircuitBoard className="w-5 h-5" />,
      monitor: <Monitor className="w-5 h-5" />,
      cooling: <Gamepad2 className="w-5 h-5" />,
      case: <Monitor className="w-5 h-5" />,
      accessories: <Smartphone className="w-5 h-5" />,
      laptop: <Laptop className="w-5 h-5" />,
      gaming: <Gamepad2 className="w-5 h-5" />,
      camera: <Camera className="w-5 h-5" />,
      audio: <Speaker className="w-5 h-5" />,
    };

    return iconMap[categoryCode] || <Grid3X3 className="w-5 h-5" />;
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-orange-500",
      "from-red-500 to-rose-500",
      "from-indigo-500 to-blue-500",
      "from-teal-500 to-cyan-500",
      "from-violet-500 to-purple-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative group">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
          <Menu className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="hidden md:block text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
            Danh mục
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300"></div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[900px] bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white shadow-2xl max-h-[85vh] overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <div className="relative">
          {/* Header với gradient background */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-4 border-b border-gray-700/50">
            <DropdownMenuLabel className="text-blue-400 text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Grid3X3 className="w-6 h-6" />
              </div>
              <div>
                <div>Danh mục sản phẩm</div>
                <div className="text-xs text-gray-400 font-normal mt-1">
                  Khám phá hàng nghìn sản phẩm công nghệ
                </div>
              </div>
            </DropdownMenuLabel>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
              {/* Grid layout cho categories */}
              <div className="grid grid-cols-2 gap-2 p-4">
                {categories.map((category, index) => (
                  <div
                    key={category.category_id}
                    className="relative group"
                    onMouseEnter={() =>
                      setHoveredCategory(category.category_id)
                    }
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <LoadingLink
                      href={`/products?category=${category.category_id}`}
                      loadingMessage={`Đang tải sản phẩm ${category.category_name}...`}
                      className="block"
                    >
                      <div className="p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg border border-gray-700/50 group-hover:border-gray-600/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryGradient(
                              index
                            )} shadow-lg`}
                          >
                            <div className="text-white">
                              {getCategoryIcon(category.category_code)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {category.category_name}
                            </div>
                            {category.product_count && (
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {category.product_count} sản phẩm
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>

                        {/* Subcategories preview */}
                        {category.children && category.children.length > 0 && (
                          <div className="space-y-1">
                            {category.children.slice(0, 3).map((child) => (
                              <div
                                key={child.category_id}
                                className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-400 transition-colors p-1 rounded"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.location.href = `/products?category=${child.category_id}`;
                                }}
                              >
                                <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full"></div>
                                <span className="truncate">
                                  {child.category_name}
                                </span>
                              </div>
                            ))}
                            {category.children.length > 3 && (
                              <div className="text-xs text-blue-400 font-medium flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />+
                                {category.children.length - 3} danh mục khác
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </LoadingLink>

                    {/* Expanded subcategories on hover */}
                    {hoveredCategory === category.category_id &&
                      category.children &&
                      category.children.length > 3 && (
                        <div className="absolute left-full top-0 ml-2 w-72 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl p-3 z-50">
                          <div className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                            {getCategoryIcon(category.category_code)}
                            {category.category_name}
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {category.children.map((child) => (
                              <LoadingLink
                                key={child.category_id}
                                href={`/products?category=${child.category_id}`}
                                loadingMessage={`Đang tải sản phẩm ${child.category_name}...`}
                              >
                                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-sm text-gray-300 hover:text-white">
                                  <div className="w-2 h-2 bg-blue-400/60 rounded-full"></div>
                                  <span>{child.category_name}</span>
                                </div>
                              </LoadingLink>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {/* Footer với popular categories */}
              <div className="border-t border-gray-700/50 bg-gray-800/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span className="text-blue-400 font-medium">Nổi bật:</span>{" "}
                    Gaming PC, RTX 40 Series, AMD Ryzen 7000
                  </div>
                  <LoadingLink
                    href="/products"
                    loadingMessage="Đang tải tất cả sản phẩm..."
                  >
                    <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors group">
                      <Grid3X3 className="w-4 h-4" />
                      Xem tất cả
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </LoadingLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
