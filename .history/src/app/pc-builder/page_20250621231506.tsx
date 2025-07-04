"use client";

import React, { useState, useEffect } from "react";
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
  <div className="min-h-screen seamless-background">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              PC Builder - Lắp ráp máy tính
            </h1>
            <p className="text-white/80 text-lg">
              Chọn linh kiện và kiểm tra tương thích để lắp ráp PC hoàn hảo
            </p>
          </div>

          {/* Build Summary */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">Cấu hình hiện tại</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">
                  {totalPrice.toLocaleString('vi-VN')} VND
                </div>
                <div className="text-white/70 text-sm">Tổng giá trị</div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center bg-white/5 rounded-lg p-3">
                <div className="text-green-400 font-semibold">
                  {Object.keys(selectedComponents).length}
                </div>
                <div className="text-white/70 text-sm">Linh kiện</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg p-3">
                <div className="text-blue-400 font-semibold">
                  {compatibilityStatus.length}
                </div>
                <div className="text-white/70 text-sm">Kiểm tra</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg p-3">
                <div className="text-yellow-400 font-semibold">
                  {Math.floor(totalPrice / 1000000)}M
                </div>
                <div className="text-white/70 text-sm">Giá (triệu)</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg p-3">
                <div className="text-purple-400 font-semibold">85%</div>
                <div className="text-white/70 text-sm">Hiệu suất</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={checkCompatibility}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Kiểm tra tương thích
              </button>
              <button 
                onClick={clearBuild}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Xóa cấu hình
              </button>
              <button 
                onClick={saveBuild}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>

          {/* Compatibility Status */}
          {compatibilityStatus.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Tình trạng tương thích</h3>
              <div className="space-y-2">
                {compatibilityStatus.map((status, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    status.compatible 
                      ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
                      : 'bg-red-500/20 border border-red-400/30 text-red-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      {status.compatible ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                      {status.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Component Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {COMPONENT_CATEGORIES.map((category) => (
              <ComponentSelector
                key={category.type}
                category={category}
                selectedComponent={selectedComponents[category.type as keyof typeof selectedComponents]}
                onSelect={(component) => selectComponent(category.type as keyof typeof selectedComponents, component)}
                onRemove={() => removeComponent(category.type as keyof typeof selectedComponents)}
              />
            ))}
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
    // Simulate loading for PC Builder initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNameEdit = () => {
    setBuildName(tempName);
    setEditingName(false);
  };

  const handleSave = async () => {
    console.log("Saving build:", currentBuild);
  };

  const renderComponentSlot = (componentType: string) => {
    const category = COMPONENT_CATEGORIES_ARRAY.find(
      (cat) => cat.key === componentType
    );
    if (!category) return null;

    const Icon =
      categoryIcons[componentType as keyof typeof categoryIcons] || Settings;
    const components = getComponentByType(componentType);
    const canAdd = canAddMoreComponents(componentType);

    // Handle the components properly - it can be undefined, single component, or array
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

        {/* Component Display Area */}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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

          {/* Build Name */}
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
            {/* Components Grid */}
            <div className="lg:col-span-2 space-y-6">
              {COMPONENT_CATEGORIES_ARRAY.map((category) =>
                renderComponentSlot(category.key)
              )}
            </div>

            {/* Build Summary */}
            <div className="space-y-6">
              {/* Price Summary */}
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

              {/* Compatibility Status */}
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
                    alert("Tính năng thêm vào giỏ hàng đang được phát triển");
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
      <PCBuilderContent />
    </PCBuilderProvider>
  );
}
