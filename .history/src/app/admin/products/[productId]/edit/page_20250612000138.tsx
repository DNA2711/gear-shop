"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Package,
  Info,
  Settings,
  Eye,
  GripVertical,
} from "lucide-react";
import Image from "next/image";
import { ProductWithDetails, ProductSpecification } from "@/types/product";
import { Brand } from "@/types/brand";
import { CategoryWithChildren } from "@/types/category";

interface ImageFile {
  file?: File;
  preview: string;
  is_primary: boolean;
  isUrl?: boolean;
}

interface ProductFormData {
  product_name: string;
  product_code: string;
  brand_id: number | null;
  category_id: number | null;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  is_active: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  // State management
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: "",
    product_code: "",
    brand_id: null,
    category_id: null,
    price: 0,
    original_price: null,
    stock_quantity: 0,
    is_active: true,
  });

  // Specifications state
  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    []
  );
  const [newSpec, setNewSpec] = useState({ spec_name: "", spec_value: "" });

  // Images state
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);

  // Image upload mode state
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file"
  );
  const [imageUrl, setImageUrl] = useState("");

  // Drag and drop state
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null
  );
  const [draggedImageType, setDraggedImageType] = useState<
    "existing" | "new" | null
  >(null);

  // Specifications drag and drop state
  const [draggedSpecIndex, setDraggedSpecIndex] = useState<number | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"basic" | "specs" | "images">(
    "basic"
  );

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productResponse = await fetch(`/api/products/${productId}`);
        const productData = await productResponse.json();

        if (productData.success) {
          const productDetails = productData.data;
          setProduct(productDetails);
          setFormData({
            product_name: productDetails.product_name || "",
            product_code: productDetails.product_code || "",
            brand_id: productDetails.brand_id || null,
            category_id: productDetails.category_id || null,
            price: productDetails.price || 0,
            original_price: productDetails.original_price || null,
            stock_quantity: productDetails.stock_quantity || 0,
            is_active: productDetails.is_active ?? true,
          });
          setSpecifications(productDetails.specifications || []);

          // Sort images by display_order and set primary image as first
          const sortedImages = (productDetails.images || []).sort(
            (a: any, b: any) => {
              if (a.is_primary) return -1;
              if (b.is_primary) return 1;
              return (a.display_order || 0) - (b.display_order || 0);
            }
          );
          setExistingImages(sortedImages);
          setPrimaryImageIndex(0); // First image is always primary
        } else {
          setError("Không tìm thấy sản phẩm");
        }

        // Fetch brands and categories
        const [brandsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);

        const brandsData = await brandsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setBrands(brandsData);
        setCategories(categoriesData.success ? categoriesData.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  // Handle form changes
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle specification management
  const handleAddSpecification = () => {
    if (newSpec.spec_name.trim() && newSpec.spec_value.trim()) {
      setSpecifications((prev) => [...prev, newSpec]);
      setNewSpec({ spec_name: "", spec_value: "" });
    }
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditSpecification = (
    index: number,
    field: "spec_name" | "spec_value",
    value: string
  ) => {
    setSpecifications((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  // Handle image management
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          setNewImages((prev) => [
            ...prev,
            {
              file,
              preview,
              is_primary: prev.length === 0 && existingImages.length === 0,
              isUrl: false,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle URL image addition
  const handleAddImageUrl = async () => {
    if (!imageUrl.trim()) {
      alert("Vui lòng nhập URL ảnh!");
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      alert("URL không hợp lệ!");
      return;
    }

    try {
      // Use server-side conversion to avoid CORS issues
      const response = await fetch("/api/brands/convert-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: imageUrl }),
      });

      if (response.ok) {
        const { base64 } = await response.json();
        setNewImages((prev) => [
          ...prev,
          {
            preview: base64,
            is_primary: prev.length === 0 && existingImages.length === 0,
            isUrl: true,
          },
        ]);
        setImageUrl("");
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error || "Không thể tải ảnh từ URL"}`);
      }
    } catch (error) {
      console.error("Error loading image from URL:", error);
      alert("Không thể tải ảnh từ URL này");
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => {
      const newArray = prev.filter((_, i) => i !== index);
      // Update primary status for new images
      return newArray.map((img, i) => ({
        ...img,
        is_primary: i === 0 && existingImages.length === 0,
      }));
    });
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => {
      const newArray = prev.filter((_, i) => i !== index);
      // Update primary status for existing images
      return newArray.map((img, i) => ({
        ...img,
        is_primary: i === 0,
      }));
    });

    // Update new images primary status if no existing images left
    if (existingImages.length === 1) {
      // Will be 0 after removal
      setNewImages((prev) =>
        prev.map((img, i) => ({
          ...img,
          is_primary: i === 0,
        }))
      );
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number, type: "existing" | "new") => {
    setDraggedImageIndex(index);
    setDraggedImageType(type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number, dropType: "existing" | "new") => {
    if (draggedImageIndex === null || draggedImageType === null) return;

    // Same type reordering
    if (draggedImageType === dropType) {
      if (dropType === "existing") {
        setExistingImages((prev) => {
          const newArray = [...prev];
          const draggedItem = newArray[draggedImageIndex];
          newArray.splice(draggedImageIndex, 1);
          newArray.splice(dropIndex, 0, draggedItem);

          // Update primary status - first image is always primary
          return newArray.map((img, i) => ({
            ...img,
            is_primary: i === 0,
          }));
        });
      } else {
        setNewImages((prev) => {
          const newArray = [...prev];
          const draggedItem = newArray[draggedImageIndex];
          newArray.splice(draggedImageIndex, 1);
          newArray.splice(dropIndex, 0, draggedItem);

          // Update primary status - first image is primary if no existing images
          return newArray.map((img, i) => ({
            ...img,
            is_primary: i === 0 && existingImages.length === 0,
          }));
        });
      }
    }

    setDraggedImageIndex(null);
    setDraggedImageType(null);
  };

  // Specifications drag and drop handlers
  const handleSpecDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSpecIndex(index);
  };

  const handleSpecDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSpecDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSpecIndex !== null && draggedSpecIndex !== targetIndex) {
      const newOrder = [...specifications];
      const draggedItem = newOrder[draggedSpecIndex];
      newOrder.splice(draggedSpecIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
      setSpecifications(newOrder);
    }
    setDraggedSpecIndex(null);
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate form
      if (!formData.product_name.trim()) {
        setError("Tên sản phẩm không được để trống");
        return;
      }
      if (!formData.product_code.trim()) {
        setError("Mã sản phẩm không được để trống");
        return;
      }
      if (formData.price <= 0) {
        setError("Giá sản phẩm phải lớn hơn 0");
        return;
      }

      // Save basic product info
      const productResponse = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const productResult = await productResponse.json();
      if (!productResult.success) {
        throw new Error(productResult.message || "Lỗi khi cập nhật sản phẩm");
      }

      // Save specifications
      // First, delete all existing specifications
      await fetch(`/api/products/${productId}/specifications`, {
        method: "DELETE",
      });

      // Then add new specifications
      for (let i = 0; i < specifications.length; i++) {
        const spec = specifications[i];
        await fetch(`/api/products/${productId}/specifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spec_name: spec.spec_name,
            spec_value: spec.spec_value,
            display_order: i + 1,
          }),
        });
      }

      // Handle image uploads if there are new images
      if (newImages.length > 0) {
        console.log(`Uploading ${newImages.length} new images...`);

        for (let i = 0; i < newImages.length; i++) {
          const imageData = newImages[i];
          console.log(`Uploading image ${i + 1}:`, {
            isUrl: imageData.isUrl,
            isPrimary: imageData.is_primary,
            displayOrder: existingImages.length + i,
          });

          if (imageData.isUrl) {
            // Handle URL images - send as JSON with base64 data
            const response = await fetch(`/api/products/${productId}/images`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image_code: imageData.preview, // base64 data
                is_primary: imageData.is_primary,
                display_order: existingImages.length + i,
                image_name: `url-image-${Date.now()}-${i}.jpg`,
              }),
            });

            const result = await response.json();
            console.log(`URL image ${i + 1} upload result:`, result);

            if (!response.ok) {
              throw new Error(`Failed to upload URL image: ${result.error}`);
            }
          } else if (imageData.file) {
            // Handle file uploads - send as FormData
            const formData = new FormData();
            formData.append("image", imageData.file);
            formData.append("is_primary", imageData.is_primary.toString());
            formData.append(
              "display_order",
              (existingImages.length + i).toString()
            );

            const response = await fetch(`/api/products/${productId}/images`, {
              method: "POST",
              body: formData,
            });

            const result = await response.json();
            console.log(`File image ${i + 1} upload result:`, result);

            if (!response.ok) {
              throw new Error(`Failed to upload file image: ${result.error}`);
            }
          }
        }

        console.log("All images uploaded successfully");
      }

      // Update existing image primary status and display order
      for (let i = 0; i < existingImages.length; i++) {
        const img = existingImages[i];
        const shouldBePrimary = i === 0;

        if (img.is_primary !== shouldBePrimary || img.display_order !== i) {
          await fetch(`/api/products/${productId}/images/${img.image_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              is_primary: shouldBePrimary,
              display_order: i,
            }),
          });
        }
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error instanceof Error ? error.message : "Lỗi khi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/admin/products")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <style jsx>{`
        .dragging {
          transform: rotate(5deg);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .drag-over {
          border-color: #3b82f6 !important;
          background-color: #eff6ff;
        }
        .spec-dragging {
          opacity: 0.5;
          transform: scale(0.95);
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        .spec-drag-over {
          border-color: #3b82f6 !important;
          background-color: #eff6ff;
          transform: translateY(-2px);
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa sản phẩm
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open(`/products/${productId}`, "_blank")}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <Eye className="w-4 h-4" />
            Xem trước
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "basic", label: "Thông tin cơ bản", icon: Package },
              { id: "specs", label: "Thông số kỹ thuật", icon: Settings },
              { id: "images", label: "Hình ảnh", icon: ImageIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.product_name}
                    onChange={(e) =>
                      handleInputChange("product_name", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.product_code}
                    onChange={(e) =>
                      handleInputChange("product_code", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mã sản phẩm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thương hiệu
                  </label>
                  <select
                    value={formData.brand_id || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "brand_id",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    Danh mục
                  </label>
                  <select
                    value={formData.category_id || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "category_id",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá bán *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá gốc
                  </label>
                  <input
                    type="number"
                    value={formData.original_price || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "original_price",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      handleInputChange(
                        "stock_quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.is_active.toString()}
                    onChange={(e) =>
                      handleInputChange("is_active", e.target.value === "true")
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Tạm dừng</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === "specs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Thông số kỹ thuật</h3>
                <span className="text-sm text-gray-500">
                  {specifications.length} thông số
                </span>
              </div>

              {/* Add new specification */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-4">Thêm thông số mới</h4>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="md:w-1/2">
                    <input
                      type="text"
                      placeholder="Tên thông số (VD: Bộ vi xử lý)"
                      value={newSpec.spec_name}
                      onChange={(e) =>
                        setNewSpec((prev) => ({
                          ...prev,
                          spec_name: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                    />
                  </div>
                  <div className="md:w-1/2 relative">
                    <textarea
                      placeholder="Giá trị (Enter để xuống dòng)"
                      value={newSpec.spec_value}
                      onChange={(e) =>
                        setNewSpec((prev) => ({
                          ...prev,
                          spec_value: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[40px] resize-y"
                      rows={Math.max(1, newSpec.spec_value.split("\n").length)}
                      style={{
                        paddingLeft: newSpec.spec_value.includes("\n")
                          ? "20px"
                          : "12px",
                      }}
                    />
                    {newSpec.spec_value.includes("\n") && (
                      <div className="absolute left-2 top-2 text-gray-600">
                        {newSpec.spec_value.split("\n").map((_, lineIndex) => (
                          <div
                            key={lineIndex}
                            className="h-6 flex items-center"
                          >
                            <span className="text-xs">•</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleAddSpecification}
                  disabled={
                    !newSpec.spec_name.trim() || !newSpec.spec_value.trim()
                  }
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Thêm
                </button>
              </div>

              {/* Specifications list */}
              <div className="space-y-3">
                {specifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có thông số kỹ thuật nào</p>
                    <p className="text-sm">
                      Thêm thông số để cung cấp thông tin chi tiết về sản phẩm
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium mb-4">
                      Thông số kỹ thuật hiện tại (kéo thả để sắp xếp)
                    </h4>
                    {specifications.map((spec, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleSpecDragStart(e, index)}
                        onDragOver={handleSpecDragOver}
                        onDrop={(e) => handleSpecDrop(e, index)}
                        className={`flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg cursor-move transition-all duration-200 hover:shadow-md mb-3 ${
                          draggedSpecIndex === index
                            ? "opacity-50 scale-95 border-blue-400"
                            : ""
                        }`}
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 mt-2" />
                        <div className="flex-1 flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/2">
                            <input
                              type="text"
                              value={spec.spec_name}
                              onChange={(e) =>
                                handleEditSpecification(
                                  index,
                                  "spec_name",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                              placeholder="Tên thông số"
                            />
                          </div>
                          <div className="md:w-1/2 relative">
                            <textarea
                              value={spec.spec_value}
                              onChange={(e) =>
                                handleEditSpecification(
                                  index,
                                  "spec_value",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[40px] resize-y"
                              placeholder="Giá trị (Enter để xuống dòng)"
                              rows={Math.max(
                                1,
                                spec.spec_value.split("\n").length
                              )}
                              style={{
                                paddingLeft: spec.spec_value.includes("\n")
                                  ? "20px"
                                  : "12px",
                              }}
                            />
                            {spec.spec_value.includes("\n") && (
                              <div className="absolute left-2 top-2 text-gray-600">
                                {spec.spec_value
                                  .split("\n")
                                  .map((_, lineIndex) => (
                                    <div
                                      key={lineIndex}
                                      className="h-6 flex items-center"
                                    >
                                      <span className="text-xs">•</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSpecification(index)}
                          className="text-red-600 hover:text-red-800 p-2 mt-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Hình ảnh sản phẩm</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Kéo thả để sắp xếp thứ tự. Ảnh đầu tiên sẽ là ảnh chính.
                  </p>
                </div>
              </div>

              {/* Image Upload Mode Selection */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Thêm hình ảnh mới</h4>
                  <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode("file")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        imageUploadMode === "file"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      📁 Upload file
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode("url")}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        imageUploadMode === "url"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      🔗 URL
                    </button>
                  </div>
                </div>

                {/* File Upload Mode */}
                {imageUploadMode === "file" && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Chọn file ảnh
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      PNG, JPG tối đa 5MB • Có thể chọn nhiều file cùng lúc
                    </p>
                  </div>
                )}

                {/* URL Mode */}
                {imageUploadMode === "url" && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddImageUrl()
                        }
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        disabled={!imageUrl.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Thêm
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Nhập URL trực tiếp đến hình ảnh (jpg, png, gif, webp)
                    </p>
                  </div>
                )}
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {existingImages.map((image, index) => (
                      <div
                        key={image.image_id}
                        className="relative group cursor-move"
                        draggable
                        onDragStart={() => handleDragStart(index, "existing")}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index, "existing")}
                      >
                        <div
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                            index === 0
                              ? "border-blue-500 shadow-blue-200 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          } transition-all duration-200 ${
                            draggedImageIndex === index &&
                            draggedImageType === "existing"
                              ? "opacity-50 scale-95"
                              : ""
                          }`}
                        >
                          <Image
                            src={image.image_code}
                            alt={image.image_name}
                            fill
                            className="object-cover"
                          />

                          {/* Drag indicator */}
                          <div className="absolute top-2 left-2 bg-white/90 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => handleRemoveExistingImage(index)}
                            className="bg-red-500/90 text-white p-1 rounded hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Ảnh chính
                          </div>
                        )}

                        {/* Position indicator */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImages.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4">
                    Ảnh mới (kéo thả để sắp xếp)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {newImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group cursor-move"
                        draggable
                        onDragStart={() => handleDragStart(index, "new")}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index, "new")}
                      >
                        <div
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                            image.is_primary
                              ? "border-blue-500 shadow-blue-200 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          } transition-all duration-200 ${
                            draggedImageIndex === index &&
                            draggedImageType === "new"
                              ? "opacity-50 scale-95"
                              : ""
                          }`}
                        >
                          <Image
                            src={image.preview}
                            alt="New image"
                            fill
                            className="object-cover"
                          />

                          {/* Drag indicator */}
                          <div className="absolute top-2 left-2 bg-white/90 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-4 h-4 text-gray-600" />
                          </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => handleRemoveNewImage(index)}
                            className="bg-red-500/90 text-white p-1 rounded hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        {image.is_primary && (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Ảnh chính
                          </div>
                        )}

                        {/* Image type indicator */}
                        {image.isUrl && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            🔗 URL
                          </div>
                        )}

                        {/* Position indicator */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {existingImages.length === 0 && newImages.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Chưa có hình ảnh nào</p>
                  <p className="text-sm">
                    Thêm hình ảnh để khách hàng có thể xem sản phẩm
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
