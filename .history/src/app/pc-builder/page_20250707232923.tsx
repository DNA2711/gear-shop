"use client";

import React, { useState, useEffect, Suspense } from "react";
import { PCBuilderProvider, usePCBuilder } from "@/contexts/PCBuilderContext";
import { COMPONENT_CATEGORIES_ARRAY } from "@/lib/pcBuilderUtils";
import ComponentCard from "@/components/pc-builder/ComponentCard";
import ComponentSelector from "@/components/pc-builder/ComponentSelector";
import {
  Plus,
  Settings,
  Save,
  FileText,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Zap,
  DollarSign,
  Trash2,
  Edit3,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Fan,
  Wrench,
  Calculator,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PCComponent } from "@/types/pcbuilder";
import { toast } from "react-hot-toast";

const categoryIcons = {
  cpu: Cpu,
  vga: Monitor,
  mainboard: Wrench,
  ram: MemoryStick,
  storage: HardDrive,
  psu: Zap,
  case: Wrench,
  cooling: Fan,
};

const PCBuilderSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"></div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function PCBuilderContent() {
  const {
    state,
    addComponent,
    removeComponent,
    clearBuild,
    setBuildName,
    openComponentModal,
    closeComponentModal,
    getComponentByType,
    canAddMoreComponents,
  } = usePCBuilder();

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.currentBuild.build_name);
  const [loading, setLoading] = useState(true);

  const { currentBuild, selectedComponentType, isComponentModalOpen } = state;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNameEdit = () => {
    setBuildName(tempName);
    setEditingName(false);
  };

  const handleSave = async () => {};

  const renderComponentSlot = (componentType: string) => {
    const category = COMPONENT_CATEGORIES_ARRAY.find(
      (cat) => cat.key === componentType
    );
    if (!category) return null;

    const Icon =
      categoryIcons[componentType as keyof typeof categoryIcons] || Settings;
    const components = getComponentByType(componentType);
    const canAdd = canAddMoreComponents(componentType);

    const componentsArray = components
      ? Array.isArray(components)
        ? components
        : [components]
      : [];

    return (
      <div
        key={componentType}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">
                {category.required ? "Bắt buộc" : "Tùy chọn"}
                {category.multipleAllowed &&
                  ` • Tối đa ${category.maxQuantity || "∞"}`}
              </p>
            </div>
          </div>
          {canAdd && (
            <button
              onClick={() => openComponentModal(componentType)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="min-h-[100px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4">
          {componentsArray.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Chưa chọn {category.name.toLowerCase()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Nhấn + để thêm linh kiện
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {componentsArray.map((component: PCComponent, index: number) => (
                <div
                  key={`${component.product_id}-${index}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {component.primary_image ? (
                      <img
                        src={component.primary_image}
                        alt={component.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {component.product_name}
                    </div>
                    {component.brand_name && (
                      <div className="text-xs text-gray-500">
                        {component.brand_name}
                      </div>
                    )}
                    <div className="text-blue-600 font-semibold">
                      {formatPrice(component.price)}
                    </div>

                    {component.specifications &&
                      component.specifications.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {component.specifications[0].spec_value}
                        </div>
                      )}
                  </div>

                  <button
                    onClick={() => removeComponent(componentType, index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Xóa linh kiện"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <PCBuilderSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Settings className="w-10 h-10 mr-3 text-blue-600" />
              PC Builder
            </h1>
            <p className="text-gray-600 text-lg">
              Thiết kế cấu hình PC mơ ước của bạn với công cụ tương thích thông
              minh
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                {editingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-lg font-semibold border-b-2 border-blue-600 focus:outline-none bg-transparent"
                      onKeyPress={(e) => e.key === "Enter" && handleNameEdit()}
                      autoFocus
                    />
                    <button
                      onClick={handleNameEdit}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentBuild.build_name}
                    </h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu</span>
                </button>
                <button
                  onClick={clearBuild}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {COMPONENT_CATEGORIES_ARRAY.map((category) =>
                renderComponentSlot(category.key)
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Tóm tắt chi phí
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng linh kiện:</span>
                    <span className="font-medium">
                      {formatPrice(currentBuild.total_price)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Công suất ước tính:</span>
                    <span className="font-medium">
                      {currentBuild.estimated_power || 0}W
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Tổng cộng:
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(currentBuild.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Tình trạng tương thích
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-700">
                      Đang kiểm tra tương thích...
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    toast("Tính năng thêm vào giỏ hàng đang được phát triển", {
                      icon: "ℹ️",
                      duration: 3000,
                    });
                  }}
                  disabled={currentBuild.total_price === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ hàng
                </button>

                <button
                  onClick={clearBuild}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Xóa cấu hình
                </button>
              </div>

              {/* Build Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  💡 Lời khuyên
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Chọn CPU và Mainboard cùng socket</li>
                  <li>• RAM phải tương thích với Mainboard</li>
                  <li>• PSU phải đủ công suất cho hệ thống</li>
                  <li>• Tản nhiệt phù hợp với CPU socket</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Selector Modal */}
      {isComponentModalOpen && selectedComponentType && (
        <ComponentSelector
          isOpen={isComponentModalOpen}
          onClose={closeComponentModal}
          componentType={selectedComponentType}
          onSelect={(component: PCComponent) => {
            addComponent(selectedComponentType, component);
            closeComponentModal();
          }}
        />
      )}
    </div>
  );
}

export default function PCBuilderPage() {
  return (
    <PCBuilderProvider>
      <Suspense fallback={<PCBuilderSkeleton />}>
        <PCBuilderContent />
      </Suspense>
    </PCBuilderProvider>
  );
}
