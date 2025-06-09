"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X, Save, Loader2 } from "lucide-react";
import {
  CategoryWithChildren,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    categoryData: CreateCategoryRequest | UpdateCategoryRequest
  ) => Promise<void>;
  category?: CategoryWithChildren | null;
  allCategories: CategoryWithChildren[];
  isLoading?: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  category,
  allCategories,
  isLoading = false,
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    category_name: "",
    category_code: "",
    parent_id: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define isDescendant function with useCallback to avoid hoisting issues
  const isDescendant = useCallback(
    (checkCategory: CategoryWithChildren, ancestorId: number): boolean => {
      if (checkCategory.parent_id === ancestorId) {
        return true;
      }
      const parent = allCategories.find(
        (c) => c.category_id === checkCategory.parent_id
      );
      return parent ? isDescendant(parent, ancestorId) : false;
    },
    [allCategories]
  );

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || "",
        category_code: category.category_code || "",
        parent_id: category.parent_id ? category.parent_id.toString() : "",
        is_active: category.is_active,
      });
    } else {
      setFormData({
        category_name: "",
        category_code: "",
        parent_id: "",
        is_active: true,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_name.trim()) {
      newErrors.category_name = "Tên danh mục là bắt buộc";
    }

    // Check for circular reference
    if (
      category &&
      formData.parent_id &&
      parseInt(formData.parent_id) === category.category_id
    ) {
      newErrors.parent_id = "Danh mục không thể là danh mục con của chính nó";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const categoryData = {
      category_name: formData.category_name.trim(),
      category_code: formData.category_code.trim(),
      parent_id: formData.parent_id ? parseInt(formData.parent_id) : undefined,
      is_active: formData.is_active,
    };

    try {
      await onSave(categoryData);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const generateSlug = (name: string) => {
    return (
      name
        .toLowerCase()
        .trim()
        // Remove Vietnamese accents
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        // Replace special Vietnamese characters
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        // Replace non-alphanumeric characters with dashes
        .replace(/[^a-z0-9]+/g, "-")
        // Remove leading/trailing dashes
        .replace(/^-+|-+$/g, "") ||
      // Ensure we have something if input is empty
      "danh-muc"
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category_name: name,
      category_code: generateSlug(name),
    }));
  };

  const availableParentCategories = useMemo(() => {
    return allCategories.filter((cat) => {
      // Exclude current category and its children to prevent circular reference
      if (category) {
        return (
          cat.category_id !== category.category_id &&
          !isDescendant(cat, category.category_id)
        );
      }
      return true;
    });
  }, [allCategories, category, isDescendant]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {category ? "Sửa danh mục" : "Thêm danh mục mới"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category_name}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập tên danh mục"
              />
              {errors.category_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category_name}
                </p>
              )}
            </div>

            {/* Auto-generated category code - hidden from user */}
            <input type="hidden" value={formData.category_code} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thuộc danh mục
              </label>
              <select
                value={formData.parent_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parent_id: e.target.value,
                  }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.parent_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">-- Danh mục gốc --</option>
                {availableParentCategories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.parent_id && (
                <p className="text-red-500 text-xs mt-1">{errors.parent_id}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-900"
              >
                Kích hoạt danh mục
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{category ? "Cập nhật" : "Tạo mới"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
