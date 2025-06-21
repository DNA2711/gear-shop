"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Settings,
  Bell,
  BellOff,
  Shield,
  Eye,
  EyeOff,
  Globe,
  Mail,
  Smartphone,
  Lock,
  User,
  Trash2,
  Download,
  Upload,
  Save,
  RotateCcw,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newProducts: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showPhone: boolean;
    dataCollection: boolean;
  };
  language: string;
  currency: string;
}

export default function SettingsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      orderUpdates: true,
      promotions: false,
      newProducts: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      dataCollection: true,
    },
    language: "vi",
    currency: "VND",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageOpen || currencyOpen) {
        setLanguageOpen(false);
        setCurrencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languageOpen, currencyOpen]);

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    try {
      // Save to localStorage (in real app, save to backend)
      localStorage.setItem("userSettings", JSON.stringify(settings));

      toast.success("Cài đặt đã được lưu thành công!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Có lỗi xảy ra khi lưu cài đặt");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings: UserSettings = {
      notifications: {
        email: true,
        push: true,
        orderUpdates: true,
        promotions: false,
        newProducts: true,
      },
      privacy: {
        profileVisible: true,
        showEmail: false,
        showPhone: false,
        dataCollection: true,
      },
      language: "vi",
      currency: "VND",
    };
    setSettings(defaultSettings);
    toast.success("Đã khôi phục cài đặt mặc định");
  };

  const handleChangePassword = () => {
    toast.info("Tính năng đổi mật khẩu sẽ được triển khai sớm");
  };

  const handleExportData = () => {
    const dataToExport = {
      user: user,
      settings: settings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `gear-hub-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Dữ liệu đã được xuất thành công!");
  };

  const tabs = [
    { id: "general", name: "Tổng quan", icon: Settings },
    { id: "notifications", name: "Thông báo", icon: Bell },
    { id: "privacy", name: "Bảo mật", icon: Shield },
    { id: "account", name: "Tài khoản", icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen seamless-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">Cài đặt</h1>
              <button
                onClick={() => router.push("/profile")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Quay lại hồ sơ
              </button>
            </div>

            <div className="space-y-8">
              {/* General Settings */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Cài đặt chung
                </h2>

                <div className="space-y-6">
                  {/* Account Settings */}
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div>
                      <h3 className="text-white font-medium">
                        Thông tin tài khoản
                      </h3>
                      <p className="text-white/70 text-sm">
                        Cập nhật thông tin cá nhân và liên hệ
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/profile")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div>
                      <h3 className="text-white font-medium">Thông báo</h3>
                      <p className="text-white/70 text-sm">
                        Quản lý thông báo email và push
                      </p>
                    </div>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Cấu hình
                    </button>
                  </div>

                  {/* Privacy */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-white font-medium">Quyền riêng tư</h3>
                      <p className="text-white/70 text-sm">
                        Kiểm soát dữ liệu và quyền riêng tư
                      </p>
                    </div>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Xem
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Bảo mật
                </h2>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div>
                      <h3 className="text-white font-medium">Đổi mật khẩu</h3>
                      <p className="text-white/70 text-sm">
                        Cập nhật mật khẩu để bảo mật tài khoản
                      </p>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>

                  {/* Two Factor Auth */}
                  <div className="flex items-center justify-between py-4 border-b border-white/10">
                    <div>
                      <h3 className="text-white font-medium">
                        Xác thực hai lớp
                      </h3>
                      <p className="text-white/70 text-sm">
                        Tăng cường bảo mật với xác thực 2FA
                      </p>
                    </div>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Thiết lập
                    </button>
                  </div>

                  {/* Login Sessions */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-white font-medium">
                        Phiên đăng nhập
                      </h3>
                      <p className="text-white/70 text-sm">
                        Quản lý các thiết bị đã đăng nhập
                      </p>
                    </div>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Xem tất cả
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-red-400/20">
                <h2 className="text-xl font-semibold text-red-400 mb-6">
                  Vùng nguy hiểm
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-white font-medium">Xóa tài khoản</h3>
                      <p className="text-white/70 text-sm">
                        Xóa vĩnh viễn tài khoản và tất cả dữ liệu
                      </p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Xóa tài khoản
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
