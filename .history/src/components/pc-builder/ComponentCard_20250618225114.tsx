"use client";

import React from 'react';
import { PCComponent } from '@/types/pcbuilder';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Info, Check, AlertTriangle } from 'lucide-react';

interface ComponentCardProps {
  component: PCComponent;
  onSelect: (component: PCComponent) => void;
  onAddToCart?: (component: PCComponent) => void;
  isSelected?: boolean;
  isCompatible?: boolean;
  compatibilityWarning?: string;
  showAddToCart?: boolean;
}

export default function ComponentCard({
  component,
  onSelect,
  onAddToCart,
  isSelected = false,
  isCompatible = true,
  compatibilityWarning,
  showAddToCart = false,
}: ComponentCardProps) {
  const handleSelect = () => {
    if (isCompatible) {
      onSelect(component);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(component);
    }
  };

  return (
    <div
      className={`
        relative border rounded-lg p-4 transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
        ${!isCompatible ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      onClick={handleSelect}
    >
      {/* Compatibility Status */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      
      {!isCompatible && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Product Image */}
      <div className="w-full h-40 mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {component.primary_image ? (
          <img
            src={`data:image/jpeg;base64,${component.primary_image}`}
            alt={component.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl opacity-30">
            📷
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Brand */}
        {component.brand_name && (
          <div className="text-sm text-gray-500 font-medium">
            {component.brand_name}
          </div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {component.product_name}
        </h3>

        {/* Price */}
        <div className="text-lg font-bold text-blue-600">
          {formatPrice(component.price)}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 text-sm">
          {component.stock_quantity > 0 ? (
            <span className="text-green-600">
              ✓ Còn {component.stock_quantity} sản phẩm
            </span>
          ) : (
            <span className="text-red-600">
              ✗ Hết hàng
            </span>
          )}
        </div>

        {/* Key Specifications */}
        {component.specifications && component.specifications.length > 0 && (
          <div className="border-t pt-2 mt-2">
            <div className="space-y-1">
              {component.specifications.slice(0, 3).map((spec, index) => (
                <div key={index} className="text-xs text-gray-600 flex">
                  <span className="font-medium min-w-[80px]">{spec.spec_name}:</span>
                  <span className="flex-1 truncate">{spec.spec_value}</span>
                </div>
              ))}
              {component.specifications.length > 3 && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  +{component.specifications.length - 3} thông số khác
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compatibility Warning */}
        {compatibilityWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-700">
            <div className="flex items-start gap-1">
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{compatibilityWarning}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSelect}
            disabled={!isCompatible || component.stock_quantity === 0}
            className={`
              flex-1 py-2 px-3 rounded text-sm font-medium transition-colors
              ${isCompatible && component.stock_quantity > 0
                ? isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSelected ? 'Đã chọn' : 'Chọn linh kiện'}
          </button>

          {showAddToCart && onAddToCart && component.stock_quantity > 0 && (
            <button
              onClick={handleAddToCart}
              className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 