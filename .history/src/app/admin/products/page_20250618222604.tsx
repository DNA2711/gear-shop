"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  Eye,
  Package,
  DollarSign,
} from "lucide-react";
import { ProductWithDetails } from "@/types/product";
import { Brand } from "@/types/brand";
import { CategoryWithChildren } from "@/types/category";
import ProductModal from "@/components/admin/ProductModal";
import { useApi } from "@/hooks/useApi";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithDetails | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<ProductWithDetails | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  // Fetch data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        _t: Date.now().toString(), // Cache busting
      });

      if (searchTerm) params.append("search", searchTerm);
      if (brandFilter) params.append("brand_id", brandFilter);
      if (categoryFilter) params.append("category_id", categoryFilter);
      if (statusFilter) params.append("is_active", statusFilter);

      // Use API wrapper for global loading
      const data = await api.get(`/api/products?${params.toString()}`, {
        loadingMessage: "Đang tải danh sách sản phẩm...",
        showLoading: true
      });

      if (data.success) {
        setProducts(data.data);
        setTotal(data.pagination.total);
      } else {
        setError(data.message || "Lỗi khi tải danh sách sản phẩm");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/brands");
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, brandFilter, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ProductWithDetails) => {
    router.push(`/admin/products/${product.product_id}/edit`);
  };

  const handleSave = async (productData: any) => {
    try {
      setModalLoading(true);
      setErrorMessage("");

      const url = editingProduct
        ? `/api/products/${editingProduct.product_id}`
        : "/api/products";

      const method = editingProduct ? "PUT" : "POST";

      // Separate images from product data
      const { images, ...productDataOnly } = productData;

      console.log("Saving product data:", {
        url,
        method,
        productDataOnly,
        imagesCount: images?.length || 0,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productDataOnly),
      });

      const data = await response.json();
      console.log("Product save response:", data);

      if (data.success) {
        // Lưu danh sách ảnh vào product_images
        let imageError = null;
        if (images && images.length > 0 && data.data?.product_id) {
          const productId = editingProduct?.product_id || data.data.product_id;

          try {
            // Nếu đang edit, xóa ảnh cũ trước
            if (editingProduct?.product_id) {
              console.log("Deleting old images for product:", productId);
              const deleteResponse = await fetch(
                `/api/products/${productId}/images`,
                {
                  method: "DELETE",
                }
              );
              if (!deleteResponse.ok) {
                throw new Error("Lỗi khi xóa ảnh cũ");
              }
            }

            // Thêm ảnh mới
            for (let i = 0; i < images.length; i++) {
              const image = images[i];
              console.log(
                `Saving image ${i + 1}/${
                  images.length
                } for product ${productId}`
              );

              const imageResponse = await fetch(
                `/api/products/${productId}/images`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    image_name: `${productDataOnly.product_name}_${i + 1}`,
                    image_code: image,
                    is_primary: i === 0, // Ảnh đầu tiên là primary
                    display_order: i + 1,
                  }),
                }
              );

              if (!imageResponse.ok) {
                const errorData = await imageResponse.json();
                console.error(`Error saving image ${i + 1}:`, errorData);
                throw new Error(
                  `Lỗi khi lưu ảnh ${i + 1}: ${
                    errorData.error || "Unknown error"
                  }`
                );
              }
            }
            console.log("All images saved successfully");
          } catch (error) {
            console.error("Error saving images:", error);
            imageError =
              error instanceof Error ? error.message : "Lỗi khi lưu ảnh";
          }
        }

        // Always refresh products list
        await fetchProducts();
        setIsModalOpen(false);

        // Show appropriate message based on image save result
        let message =
          data.message ||
          (editingProduct
            ? "Cập nhật sản phẩm thành công!"
            : "Tạo sản phẩm mới thành công!");

        if (imageError) {
          message += ` Tuy nhiên có lỗi khi lưu ảnh: ${imageError}`;
        }

        setSuccessMessage(message);
        setShowSuccessModal(true);
      } else {
        console.error("Product save failed:", data);

        // Always refresh products list even if API says failed
        // (because database might have been updated)
        await fetchProducts();

        setErrorMessage(data.message || "Có lỗi xảy ra khi lưu sản phẩm");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error saving product:", error);

      // Always refresh products list even on error
      // (because database might have been updated)
      await fetchProducts();

      setErrorMessage(
        error instanceof Error
          ? `Lỗi kết nối đến server: ${error.message}`
          : "Lỗi kết nối đến server"
      );
      setShowErrorModal(true);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = (product: ProductWithDetails) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `/api/products/${productToDelete.product_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchProducts();
        setShowDeleteModal(false);
        setProductToDelete(null);
        setSuccessMessage(data.message || "Xóa sản phẩm thành công!");
        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.message || "Có lỗi xảy ra khi xóa sản phẩm");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMessage("Lỗi kết nối đến server");
      setShowErrorModal(true);
    }
  };

  const toggleStatus = async (product: ProductWithDetails) => {
    try {
      const response = await fetch(
        `/api/products/${product.product_id}/toggle-status`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchProducts();
      } else {
        setErrorMessage(
          data.message || "Có lỗi xảy ra khi thay đổi trạng thái"
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      setErrorMessage("Lỗi kết nối đến server");
      setShowErrorModal(true);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải sản phẩm...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="h-8 w-8" />
            <span className="ml-2">{error}</span>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={fetchProducts}
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchProducts}
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
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
            </div>
            <Package className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Đang hoạt động
              </p>
              <p className="text-3xl font-bold text-green-600">
                {products.filter((p) => p.is_active).length}
              </p>
            </div>
            <Eye className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tạm dừng</p>
              <p className="text-3xl font-bold text-red-600">
                {products.filter((p) => !p.is_active).length}
              </p>
            </div>
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Filter Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Tạm dừng</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thương hiệu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <span>
                      Chưa có sản phẩm nào. Hãy tạo sản phẩm đầu tiên!
                    </span>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-80">
                      <div
                        className="text-sm font-medium text-gray-900 truncate max-w-xs cursor-help"
                        title={product.product_name}
                      >
                        {product.product_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.brand_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          product.stock_quantity <= 10
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.is_active ? "Hoạt động" : "Tạm dừng"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            window.open(
                              `/products/${product.product_id}`,
                              "_blank"
                            )
                          }
                          className="text-gray-600 hover:text-gray-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Chỉnh sửa chi tiết"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {(page - 1) * limit + 1} đến{" "}
                {Math.min(page * limit, total)} trong tổng số {total} sản phẩm
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-sm">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
        brands={brands}
        categories={categories}
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
      {showDeleteModal && productToDelete && (
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
                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                <strong>"{productToDelete.product_name}"</strong>?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
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

      {/* Error Modal */}
      {showErrorModal && (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi!</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
