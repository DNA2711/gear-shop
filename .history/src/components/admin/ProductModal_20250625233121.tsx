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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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
    // Reset errors when modal opens/closes
    setErrors({});
    setTouched({});
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
    // Clear error when user starts typing
    if (errors.product_name) {
      setErrors({ ...errors, product_name: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.product_name.trim()) {
      newErrors.product_name = "Tên sản phẩm không được để trống";
    } else if (formData.product_name.trim().length < 3) {
      newErrors.product_name = "Tên sản phẩm phải có ít nhất 3 ký tự";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Giá sản phẩm phải lớn hơn 0";
    }

    if (!formData.brand_id) {
      newErrors.brand_id = "Vui lòng chọn thương hiệu";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Vui lòng chọn danh mục";
    }

    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = "Số lượng tồn kho không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });

    // Clear error when user changes the field
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    setTouched({
      product_name: true,
      price: true,
      brand_id: true,
      category_id: true,
      stock_quantity: true,
    });

    if (!validateForm()) {
      return; // Don't submit if validation fails
    }

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
                onBlur={() => setTouched({ ...touched, product_name: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  touched.product_name && errors.product_name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập tên sản phẩm..."
              />
              {touched.product_name && errors.product_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.product_name}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleFieldChange("price", e.target.value)}
                onBlur={() => setTouched({ ...touched, price: true })}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  touched.price && errors.price
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập giá bán..."
              />
              {touched.price && errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
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
                    handleFieldChange("brand_id", e.target.value)
                  }
                  onBlur={() => setTouched({ ...touched, brand_id: true })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    touched.brand_id && errors.brand_id
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_id}>
                      {brand.brand_name}
                    </option>
                  ))}
                </select>
                {touched.brand_id && errors.brand_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    handleFieldChange("category_id", e.target.value)
                  }
                  onBlur={() => setTouched({ ...touched, category_id: true })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    touched.category_id && errors.category_id
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
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
                {touched.category_id && errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category_id}
                  </p>
                )}
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
                onChange={(e) => handleFieldChange("stock_quantity", e.target.value)}
                onBlur={() => setTouched({ ...touched, stock_quantity: true })}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  touched.stock_quantity && errors.stock_quantity
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="Nhập số lượng tồn kho..."
              />
              {touched.stock_quantity && errors.stock_quantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>
              )}
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
