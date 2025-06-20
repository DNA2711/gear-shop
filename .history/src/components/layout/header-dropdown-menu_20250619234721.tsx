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
            children: cat.children?.slice(0, 4) || [] // Limit 4 subcategories
          }));
        setCategories(topCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback data
      setCategories([
        {
          category_id: 1,
          category_name: "CPU",
          category_code: "cpu",
          product_count: 125,
          children: [
            { category_id: 11, category_name: "Intel", category_code: "intel-cpu" },
            { category_id: 12, category_name: "AMD", category_code: "amd-cpu" },
          ]
        },
        {
          category_id: 2,
          category_name: "VGA",
          category_code: "vga", 
          product_count: 89,
          children: [
            { category_id: 21, category_name: "NVIDIA", category_code: "nvidia-vga" },
            { category_id: 22, category_name: "AMD", category_code: "amd-vga" },
          ]
        },
        {
          category_id: 3,
          category_name: "RAM",
          category_code: "ram",
          product_count: 167,
        },
        {
          category_id: 4,
          category_name: "Storage",
          category_code: "storage",
          product_count: 98,
        },
        {
          category_id: 5,
          category_name: "Mainboard",
          category_code: "mainboard",
          product_count: 76,
        },
        {
          category_id: 6,
          category_name: "Monitor",
          category_code: "monitor",
          product_count: 156,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryCode: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      cpu: <Cpu className="w-4 h-4" />,
      vga: <Monitor className="w-4 h-4" />,
      ram: <HardDrive className="w-4 h-4" />,
      storage: <HardDrive className="w-4 h-4" />,
      mainboard: <Cpu className="w-4 h-4" />,
      monitor: <Monitor className="w-4 h-4" />,
      cooling: <Gamepad2 className="w-4 h-4" />,
      case: <Monitor className="w-4 h-4" />,
      accessories: <Smartphone className="w-4 h-4" />,
      laptop: <Laptop className="w-4 h-4" />,
    };

    return iconMap[categoryCode] || <Grid3X3 className="w-4 h-4" />;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "text-blue-400",
      "text-green-400", 
      "text-purple-400",
      "text-yellow-400",
      "text-pink-400",
      "text-cyan-400",
      "text-orange-400",
      "text-indigo-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-200 group">
        <Menu className="w-6 h-6 cursor-pointer text-blue-400 group-hover:text-blue-300 transition-colors" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 bg-gray-900 border-gray-700 text-white shadow-2xl max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="text-blue-400 text-lg font-semibold py-3 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          Danh mục sản phẩm
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-700" />

        {loading ? (
          <div className="p-4">
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {categories.map((category, index) => (
              <div key={category.category_id}>
                <LoadingLink
                  href={`/products?category=${category.category_id}`}
                  loadingMessage={`Đang tải sản phẩm ${category.category_name}...`}
                >
                  <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer py-3 px-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className={`${getCategoryColor(index)}`}>
                          {getCategoryIcon(category.category_code)}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {category.category_name}
                          </div>
                          {category.product_count && (
                            <div className="text-xs text-gray-400">
                              {category.product_count} sản phẩm
                            </div>
                          )}
                        </div>
                      </div>
                      {category.children && category.children.length > 0 && (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </DropdownMenuItem>
                </LoadingLink>

                {/* Subcategories */}
                {category.children && category.children.length > 0 && (
                  <div className="bg-gray-800/50 border-l-2 border-gray-700 ml-4">
                    {category.children.map((child) => (
                      <LoadingLink
                        key={child.category_id}
                        href={`/products?category=${child.category_id}`}
                        loadingMessage={`Đang tải sản phẩm ${child.category_name}...`}
                      >
                        <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer py-2 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            <span className="text-sm text-gray-300 hover:text-white transition-colors">
                              {child.category_name}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      </LoadingLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <DropdownMenuSeparator className="bg-gray-700" />

            {/* View All Categories Link */}
            <LoadingLink
              href="/products"
              loadingMessage="Đang tải tất cả sản phẩm..."
            >
              <DropdownMenuItem className="hover:bg-blue-900 cursor-pointer py-3 px-4">
                <div className="flex items-center justify-center w-full gap-2 text-blue-400 hover:text-blue-300 font-medium">
                  <Grid3X3 className="w-4 h-4" />
                  Xem tất cả sản phẩm
                  <ChevronRight className="w-4 h-4" />
                </div>
              </DropdownMenuItem>
            </LoadingLink>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
