"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { PCComponent, ComponentFilter } from "@/types/pcbuilder";
import { COMPONENT_CATEGORIES } from "@/lib/pcBuilderUtils";
import ComponentCard from "./ComponentCard";
import { useApi } from "@/hooks/useApi";

interface ComponentSelectorProps {
  isOpen: boolean;
  componentType: string;
  onClose: () => void;
  onSelect: (component: PCComponent) => void;
  currentBuild?: any;
}

export default function ComponentSelector({
  isOpen,
  componentType,
  onClose,
  onSelect,
  currentBuild,
}: ComponentSelectorProps) {
  const [components, setComponents] = useState<PCComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<ComponentFilter>({
    min_price: undefined,
    max_price: undefined,
    brand_id: undefined,
    search: "",
  });

  const { get } = useApi();

  const category =
    COMPONENT_CATEGORIES[componentType as keyof typeof COMPONENT_CATEGORIES];

  const fetchComponents = useCallback(async () => {
    if (!componentType) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        category_code: componentType,
        page: currentPage.toString(),
        limit: "12",
      });

      if (filters.search) queryParams.set("search", filters.search);
      if (filters.min_price)
        queryParams.set("min_price", filters.min_price.toString());
      if (filters.max_price)
        queryParams.set("max_price", filters.max_price.toString());
      if (filters.brand_id)
        queryParams.set("brand_id", filters.brand_id.toString());

      const response = await get(`/api/pc-builder/components?${queryParams}`);

      if (response.success) {
        setComponents(response.data.components);
        setTotalPages(response.data.pagination.totalPages);
        setTotal(response.data.pagination.total);
      } else {
        setError("Không thể tải danh sách linh kiện");
      }
    } catch (err) {
      console.error("Error fetching components:", err);
      setError("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [componentType, currentPage, filters, get]);

  useEffect(() => {
    if (isOpen) {
      fetchComponents();
    }
  }, [isOpen, fetchComponents]);

  // Reset when component type changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setFilters({
      min_price: undefined,
      max_price: undefined,
      brand_id: undefined,
      search: "",
    });
  }, [componentType]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof ComponentFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelect = (component: PCComponent) => {
    onSelect(component);
    onClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">{category?.icon}</span>
              Chọn {category?.name}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {total} sản phẩm khả dụng
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tìm
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                showFilters
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Lọc
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá từ
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.min_price || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "min_price",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá đến
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={filters.max_price || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "max_price",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilters({
                        min_price: undefined,
                        max_price: undefined,
                        brand_id: undefined,
                        search: "",
                      });
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải sản phẩm...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p className="text-lg font-medium mb-2">Có lỗi xảy ra</p>
                <p>{error}</p>
                <button
                  onClick={fetchComponents}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : components.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium mb-2">
                  Không tìm thấy sản phẩm
                </p>
                <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {components.map((component) => (
                <ComponentCard
                  key={component.product_id}
                  component={component}
                  onSelect={handleSelect}
                  isCompatible={true} // TODO: Add compatibility checking
                  showAddToCart={false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages} (Tổng {total} sản phẩm)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
