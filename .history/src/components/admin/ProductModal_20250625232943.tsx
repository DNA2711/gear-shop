"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { ProductWithDetails } from "@/types/product";
import { Brand } from "@/types/brand";
import { CategoryWithChildren } from "@/types/category";
import { MultiImageUpload } from "./MultiImageUpload";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  product?: ProductWithDetails | null;
  brands: Brand[];
  categories: CategoryWithChildren[];
  isLoading: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  brands,
  categories,
  isLoading,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
    price: "",
    brand_id: "",
    category_id: "",
    stock_quantity: "",
    is_active: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const fetchProductImages = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/images`);
      const data = await response.json();
      if (data.success && data.data) {
        const imageList = data.data.map((img: any) => img.image_code);
        setImages(imageList);
      }
    } catch (error) {
      console.error("Error fetching product images:", error);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || "",
        product_code: product.product_code || "",
        price: product.price?.toString() || "",
        brand_id: product.brand_id?.toString() || "",
        category_id: product.category_id?.toString() || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        is_active: product.is_active,
      });
      // Load existing images if editing
      if (product.product_id) {
        fetchProductImages(product.product_id);
      } else {
        setImages([]);
      }
    } else {
      setFormData({
        product_name: "",
        product_code: "",
        price: "",
        brand_id: "",
        category_id: "",
        stock_quantity: "",
        is_active: true,
      });
      setImages([]);
    }
  }, [product, isOpen]);

  const generateProductCode = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toUpperCase();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      product_name: name,
      product_code: generateProductCode(name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      brand_id: parseInt(formData.brand_id),
      category_id: parseInt(formData.category_id),
      stock_quantity: parseInt(formData.stock_quantity),
      images: images,
    };

    onSave(submitData);
  };

  const getAllCategories = (
    categories: CategoryWithChildren[]
  ): CategoryWithChildren[] => {
    const result: CategoryWithChildren[] = [];

    const addCategories = (cats: CategoryWithChildren[], prefix = "") => {
      cats.forEach((cat) => {
        result.push({
          ...cat,
          category_name: prefix + cat.category_name,
        });
        if (cat.children && cat.children.length > 0) {
          addCategories(cat.children, prefix + cat.category_name + " > ");
        }
      });
    };

    addCategories(categories);
    return result;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={handleNameChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên sản phẩm..."
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập giá bán..."
              />
            </div>

            {/* Brand and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.brand_id}
                  onChange={(e) =>
                    setFormData({ ...formData, brand_id: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_id}>
                      {brand.brand_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {getAllCategories(categories).map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) =>
                  setFormData({ ...formData, stock_quantity: e.target.value })
                }
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số lượng tồn kho..."
              />
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh sản phẩm
              </label>
              <MultiImageUpload
                value={images}
                onChange={setImages}
                maxImages={5}
              />
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Kích hoạt sản phẩm
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{product ? "Cập nhật" : "Thêm mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
