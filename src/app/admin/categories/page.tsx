"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  CategoryWithChildren,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";
import CategoryModal from "@/components/admin/CategoryModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryWithChildren[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithChildren | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryWithChildren | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hierarchical categories for display
      const hierarchyResponse = await fetch("/api/categories?hierarchy=true");
      const hierarchyData = await hierarchyResponse.json();

      // Fetch all categories for modal selection
      const allResponse = await fetch("/api/categories");
      const allData = await allResponse.json();

      if (hierarchyData.success && allData.success) {
        setCategories(hierarchyData.data);
        setAllCategories(allData.data);
      } else {
        setError(
          hierarchyData.message || allData.message || "Lỗi khi tải danh mục"
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleExpand = (id: number) => {
    const updateExpanded = (
      items: CategoryWithChildren[]
    ): CategoryWithChildren[] => {
      return items.map((item) => {
        if (item.category_id === id) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children) {
          return { ...item, children: updateExpanded(item.children) };
        }
        return item;
      });
    };
    setCategories(updateExpanded(categories));
  };

  const handleEdit = (category: CategoryWithChildren) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleSave = async (
    categoryData: CreateCategoryRequest | UpdateCategoryRequest
  ) => {
    try {
      setModalLoading(true);

      const url = editingCategory
        ? `/api/categories/${editingCategory.category_id}`
        : "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCategories(); // Refresh the list
        setIsModalOpen(false);
        setSuccessMessage(
          data.message ||
            (editingCategory
              ? "Cập nhật danh mục thành công!"
              : "Tạo danh mục mới thành công!")
        );
        setShowSuccessModal(true);
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Lỗi kết nối đến server");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = (category: CategoryWithChildren) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(
        `/api/categories/${categoryToDelete.category_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchCategories(); // Refresh the list
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        setSuccessMessage(data.message || "Xóa danh mục thành công!");
        setShowSuccessModal(true);
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Lỗi kết nối đến server");
    }
  };

  const toggleStatus = async (category: CategoryWithChildren) => {
    try {
      const response = await fetch(
        `/api/categories/${category.category_id}/toggle-status`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchCategories(); // Refresh the list
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Lỗi kết nối đến server");
    }
  };

  const renderCategory = (
    category: CategoryWithChildren,
    level: number = 0
  ) => {
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.category_id}>
        <div
          className={`flex items-center py-3 px-4 hover:bg-gray-50 border-b border-gray-100`}
          style={{ paddingLeft: `${level * 24 + 16}px` }}
        >
          <div className="flex items-center flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(category.category_id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {category.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6 mr-2"></div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {category.category_name}
                  </h3>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    {category.product_count || 0} sản phẩm
                  </span>

                  <button
                    onClick={() => toggleStatus(category)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      category.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.is_active ? "Hoạt động" : "Tạm dừng"}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {hasChildren && category.isExpanded && (
          <div>
            {category.children!.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải danh mục...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="h-8 w-8" />
            <span className="ml-2">{error}</span>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchCategories}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Làm mới</span>
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm danh mục</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <span>Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!</span>
            </div>
          ) : (
            categories.map((category) => renderCategory(category))
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        category={editingCategory}
        allCategories={allCategories}
        isLoading={modalLoading}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Thành công!
              </h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <strong>"{categoryToDelete.category_name}"</strong>?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
