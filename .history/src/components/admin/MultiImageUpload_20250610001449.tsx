"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";

interface MultiImageUploadProps {
  value: string[]; // Array of base64 strings or URLs
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  value = [],
  onChange,
  disabled = false,
  className,
  maxImages = 5,
}: MultiImageUploadProps) {
  const [imageType, setImageType] = useState<"url" | "upload">("url");
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle URL image conversion
  const handleUrlAdd = async () => {
    if (!urlInput.trim()) {
      alert("Vui lòng nhập URL ảnh!");
      return;
    }

    if (value.length >= maxImages) {
      alert(`Tối đa ${maxImages} ảnh!`);
      return;
    }

    // Validate URL format
    try {
      new URL(urlInput);
    } catch {
      alert("URL không hợp lệ!");
      return;
    }

    setIsLoading(true);

    try {
      // Use server-side conversion to avoid CORS issues
      const response = await fetch("/api/brands/convert-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: urlInput }),
      });

      if (response.ok) {
        const { base64 } = await response.json();
        onChange([...value, base64]);
        setUrlInput("");
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      console.error("Error loading image from URL:", error);
      alert("Không thể tải ảnh từ URL này");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      alert(`Tối đa ${maxImages} ảnh!`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    // Validate files
    for (const file of filesToProcess) {
      if (!file.type.startsWith("image/")) {
        alert("Chỉ chấp nhận file ảnh!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File ảnh không được vượt quá 5MB!");
        return;
      }
    }

    setIsLoading(true);

    try {
      const newImages: string[] = [];
      for (const file of filesToProcess) {
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }
      onChange([...value, ...newImages]);
    } catch (error) {
      alert("Lỗi khi xử lý file ảnh!");
    } finally {
      setIsLoading(false);
    }

    // Reset file input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const canAddMore = value.length < maxImages;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Display existing images */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
              />
              {/* Primary badge for first image */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Ảnh chính
                </div>
              )}
              {/* Remove button */}
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add more images section */}
      {canAddMore && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Thêm ảnh ({value.length}/{maxImages})
              {value.length === 0 && " • Ảnh đầu tiên sẽ là ảnh chính"}
            </p>
          </div>

          {/* Type Selection Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setImageType("url")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                imageType === "url"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🔗 URL
            </button>
            <button
              type="button"
              onClick={() => setImageType("upload")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                imageType === "upload"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📁 Upload file
            </button>
          </div>

          {/* URL Input */}
          {imageType === "url" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleUrlAdd()}
                  disabled={disabled || isLoading}
                />
                <Button
                  type="button"
                  onClick={handleUrlAdd}
                  disabled={disabled || isLoading || !urlInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Đang tải..." : "Thêm"}
                </Button>
              </div>
            </div>
          )}

          {/* File Upload */}
          {imageType === "upload" && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={disabled || isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                          file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">
                PNG, JPG tối đa 5MB • Có thể chọn nhiều file cùng lúc
              </p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">
                Đang xử lý ảnh...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
