"use client";

import React, { useState } from "react";
import { PCBuilderProvider, usePCBuilder } from "@/contexts/PCBuilderContext";
import { COMPONENT_CATEGORIES } from "@/lib/pcBuilderUtils";
import ComponentSelector from "@/components/pc-builder/ComponentSelector";
import {
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  Zap,
  DollarSign,
  ShoppingCart,
  Save,
  Download,
  Upload,
  Trash2,
  Edit3,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PCComponent } from "@/types/pcbuilder";

function PCBuilderContent() {
  const {
    state,
    setBuildName,
    addComponent,
    removeComponent,
    clearBuild,
    openComponentModal,
    closeComponentModal,
    getComponentCount,
    getComponentByType,
    canAddMoreComponents,
  } = usePCBuilder();

  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.currentBuild.build_name);

  const { currentBuild, selectedComponentType, isComponentModalOpen } = state;
  const { compatibility_status } = currentBuild;

  const handleNameSave = () => {
    setBuildName(tempName);
    setEditingName(false);
  };

  const handleAddToCart = () => {
    console.log("Adding build to cart:", currentBuild);
  };

  const handleSaveBuild = () => {
    console.log("Saving build:", currentBuild);
  };

  const renderComponentSlot = (componentType: string) => {
    const category =
      COMPONENT_CATEGORIES[componentType as keyof typeof COMPONENT_CATEGORIES];
    const component = getComponentByType(componentType);
    const count = getComponentCount(componentType);
    const canAdd = canAddMoreComponents(componentType);

    if (!category) return null;

    const renderSingleComponent = (comp: PCComponent, index?: number) => (
      <div
        key={index || 0}
        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {comp.primary_image ? (
            <img
              src={comp.primary_image}
              alt={comp.product_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl opacity-30">{category.icon}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {comp.product_name}
          </div>
          {comp.brand_name && (
            <div className="text-xs text-gray-500">{comp.brand_name}</div>
          )}
          <div className="text-blue-600 font-semibold">
            {formatPrice(comp.price)}
          </div>

          {comp.specifications && comp.specifications.length > 0 && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              {comp.specifications[0].spec_value}
            </div>
          )}
        </div>

        <button
          onClick={() => removeComponent(componentType, index)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          title="Xóa linh kiện"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );

    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              {category.required && (
                <span className="text-xs text-red-500">* Bắt buộc</span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {count > 0 ? `${count} linh kiện` : "Chưa chọn"}
          </div>
        </div>

        <div className="space-y-3">
          {component ? (
            Array.isArray(component) ? (
              component.map((comp, index) => renderSingleComponent(comp, index))
            ) : (
              renderSingleComponent(component)
            )
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <span className="text-4xl opacity-30 block mb-2">
                {category.icon}
              </span>
              <p className="text-gray-500 mb-3">
                Chưa chọn {category.name.toLowerCase()}
              </p>
              <button
                onClick={() => openComponentModal(componentType)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Chọn linh kiện
              </button>
            </div>
          )}

          {component && category.multiple_allowed && canAdd && (
            <button
              onClick={() => openComponentModal(componentType)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm {category.name.toLowerCase()}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🖥️</div>
                <div>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleNameSave();
                          if (e.key === "Escape") {
                            setTempName(currentBuild.build_name);
                            setEditingName(false);
                          }
                        }}
                        className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleNameSave}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {currentBuild.build_name}
                      </h1>
                      <button
                        onClick={() => setEditingName(true)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-gray-600">Thiết kế cấu hình PC của bạn</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={clearBuild}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa hết
                </button>
                <button
                  onClick={handleSaveBuild}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Lưu cấu hình
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(COMPONENT_CATEGORIES).map((componentType) => (
                <div key={componentType}>
                  {renderComponentSlot(componentType)}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Tổng kết
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng giá:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatPrice(currentBuild.total_price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Công suất:
                    </span>
                    <span className="font-medium">
                      {currentBuild.estimated_power}W
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        Linh kiện đã chọn:{" "}
                        {
                          Object.values(currentBuild.components).filter(
                            (c) => c
                          ).length
                        }
                      </div>
                      <div>
                        Bắt buộc:{" "}
                        {
                          Object.entries(COMPONENT_CATEGORIES).filter(
                            ([_, cat]) => cat.required
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!compatibility_status.is_compatible}
                  className={`
                    w-full mt-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                    ${
                      compatibility_status.is_compatible
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                  `}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  {compatibility_status.is_compatible ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  Tương thích
                </h3>

                {compatibility_status.is_compatible ? (
                  <div className="text-green-600 text-sm">
                    ✓ Cấu hình tương thích tốt
                  </div>
                ) : (
                  <div className="space-y-2">
                    {compatibility_status.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-red-600 text-sm flex items-start gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {compatibility_status.warnings.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-yellow-700">Cảnh báo:</h4>
                    {compatibility_status.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="text-yellow-600 text-sm flex items-start gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{warning.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedComponentType && (
        <ComponentSelector
          isOpen={isComponentModalOpen}
          componentType={selectedComponentType}
          onClose={closeComponentModal}
          onSelect={(component) =>
            addComponent(selectedComponentType, component)
          }
          currentBuild={currentBuild}
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
