"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, ExternalLink } from "lucide-react";
import { Brand, BrandFormData } from "@/types/brand";
import { toast } from "react-hot-toast";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    brand_name: "",
    brand_code: "",
    logo_code: "",
    website: "",
  });
  const [logoType, setLogoType] = useState<"url" | "upload">("url");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [logoBase64, setLogoBase64] = useState<string>("");


  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleLogoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Chỉ chấp nhận file ảnh");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh không được vượt quá 5MB");
        return;
      }

      setLogoFile(file);

      const base64 = await fileToBase64(file);
      setLogoPreview(base64);
      setLogoBase64(base64);
      setFormData({ ...formData, logo_code: base64 });
    }
  };

  
  const handleLogoUrlChange = async (url: string) => {
    setOriginalUrl(url);
    setFormData({ ...formData, logo_code: url });

    if (url && url.startsWith("http")) {
      try {
        
        const response = await fetch("/api/brands/convert-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: url }),
        });

        if (response.ok) {
          const { base64 } = await response.json();
          setLogoPreview(base64);
          setLogoBase64(base64);
        } else {
          const error = await response.json();
          console.error("Error converting image:", error.error);
          setLogoPreview("");
          setLogoBase64("");
          toast.error(`Lỗi: ${error.error}`);
        }
      } catch (error) {
        console.error("Error loading image from URL:", error);
        setLogoPreview("");
        setLogoBase64("");
        toast.error("Không thể tải ảnh từ URL này");
      }
    } else {
      setLogoPreview("");
      setLogoBase64("");
    }
  };


  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/brands");
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      } else {
        console.error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(
    (brand) =>
      brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.brand_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({
      brand_name: "",
      brand_code: "",
      logo_code: "",
      website: "",
    });
    setLogoType("url");
    setLogoFile(null);
    setLogoPreview("");
    setOriginalUrl("");
    setLogoBase64("");
    setShowModal(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      brand_name: brand.brand_name,
      brand_code: brand.brand_code,
      logo_code: brand.logo_code || "",
      website: brand.website || "",
    });

    const isBase64 = brand.logo_code && brand.logo_code.startsWith("data:");
    setLogoType(isBase64 ? "upload" : "url");
    setLogoFile(null);
    setLogoPreview(brand.logo_code || "");
    setOriginalUrl(isBase64 ? "" : brand.logo_code || "");
    setLogoBase64(isBase64 ? brand.logo_code || "" : "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBrand(null);
    setFormData({
      brand_name: "",
      brand_code: "",
      logo_code: "",
      website: "",
    });
    setLogoType("url");
    setLogoFile(null);
    setLogoPreview("");
    setOriginalUrl("");
    setLogoBase64("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingBrand
        ? `/api/brands/${editingBrand.brand_id}`
        : "/api/brands";
      const method = editingBrand ? "PUT" : "POST";

      const submitData = {
        ...formData,
        logo_code:
          logoType === "url" && logoBase64 ? logoBase64 : formData.logo_code,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        await fetchBrands();
        closeModal();

        const message = editingBrand
          ? "Cập nhật thương hiệu thành công!"
          : "Thêm thương hiệu thành công!";
        setSuccessMessage(message);
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        toast.error(error.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Có lỗi xảy ra khi lưu thương hiệu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (brand: Brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;

    try {
      const response = await fetch(`/api/brands/${brandToDelete.brand_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
          await fetchBrands();
        setShowDeleteModal(false);
        setBrandToDelete(null);
        setSuccessMessage("Xóa thương hiệu thành công!");
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        toast.error(error.error || "Có lỗi xảy ra khi xóa thương hiệu");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Có lỗi xảy ra khi xóa thương hiệu");
    }
  };

  const renderLogo = (brand: Brand) => {
    if (!brand.logo_code) {
      return (
        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {brand.brand_name.charAt(0)}
          </span>
        </div>
      );
    }

    if (brand.logo_code.startsWith("data:image")) {
      return (
        <div className="h-10 w-10 rounded-lg flex items-center justify-center border border-gray-200">
          <img
            src={brand.logo_code}
            alt={brand.brand_name}
            className="h-8 w-8 object-contain"
            style={{
              background: "transparent",
              backgroundColor: "transparent",
            }}
          />
        </div>
      );
    }

    return (
      <div className="h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
        <img
          src={brand.logo_code}
          alt={brand.brand_name}
          className="h-8 w-8 object-contain"
          style={{
            background: "transparent",
            backgroundColor: "transparent",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement!;
            parent.innerHTML = `<span class="text-sm font-medium text-gray-600">${brand.brand_name.charAt(
              0
            )}</span>`;
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý thương hiệu
        </h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm thương hiệu</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Đang tải...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thương hiệu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã thương hiệu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBrands.map((brand) => (
                  <tr key={brand.brand_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderLogo(brand)}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {brand.brand_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {brand.brand_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {brand.website ? (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <span className="text-sm">{brand.website}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Chưa có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(brand)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredBrands.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy thương hiệu nào
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingBrand ? "Sửa thương hiệu" : "Thêm thương hiệu"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thương hiệu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand_name}
                  onChange={(e) =>
                    setFormData({ ...formData, brand_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên thương hiệu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã thương hiệu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brand_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      brand_code: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, ""),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="nhapmathuonghieu"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ cho phép chữ thường và số, không có dấu cách
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>

                <div className="flex rounded-lg bg-gray-100 p-1 mb-3">
                  <button
                    type="button"
                    onClick={() => setLogoType("url")}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                      logoType === "url"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    🔗 URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoType("upload")}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                      logoType === "upload"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    📁 Upload file
                  </button>
                </div>

                {logoType === "url" && (
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => handleLogoUrlChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                )}

                {logoType === "upload" && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {logoPreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 object-contain border border-gray-200 rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Đang lưu..."
                    : editingBrand
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {showDeleteModal && brandToDelete && (
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
                Bạn có chắc chắn muốn xóa thương hiệu{" "}
                <strong>"{brandToDelete.brand_name}"</strong>?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBrandToDelete(null);
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
