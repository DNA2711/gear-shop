"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Settings,
  Moon,
  Sun,
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
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UserSettings {
  theme: "light" | "dark" | "system";
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

  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
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

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    try {
      // Save to localStorage (in real app, save to backend)
      localStorage.setItem("userSettings", JSON.stringify(settings));

      // Apply theme changes immediately
      if (settings.theme !== "system") {
        document.documentElement.classList.toggle(
          "dark",
          settings.theme === "dark"
        );
      }

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
      theme: "system",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
              <Settings className="w-8 h-8 mr-3 text-blue-600" />
              Cài đặt
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý tùy chọn và cài đặt tài khoản của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 via-transparent to-purple-600/3"></div>

              <div className="relative space-y-8">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Cài đặt tổng quan
                    </h2>

                    {/* Theme Settings */}
                    <div className="bg-gray-50/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                        Giao diện
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: "light", label: "Sáng", icon: Sun },
                          { value: "dark", label: "Tối", icon: Moon },
                          {
                            value: "system",
                            label: "Hệ thống",
                            icon: Settings,
                          },
                        ].map((theme) => {
                          const Icon = theme.icon;
                          return (
                            <button
                              key={theme.value}
                              onClick={() =>
                                setSettings((prev) => ({
                                  ...prev,
                                  theme: theme.value as any,
                                }))
                              }
                              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                settings.theme === theme.value
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-2" />
                              <span className="text-sm font-medium">
                                {theme.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Language & Currency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Globe className="w-5 h-5 mr-2 text-blue-500" />
                          Ngôn ngữ
                        </h3>
                        <select
                          value={settings.language}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              language: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>

                      <div className="bg-gray-50/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-5 h-5 mr-2 text-2xl">💰</span>
                          Tiền tệ
                        </h3>
                        <select
                          value={settings.currency}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              currency: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="VND">VND (₫)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Cài đặt thông báo
                    </h2>

                    <div className="space-y-4">
                      {[
                        {
                          key: "email",
                          label: "Thông báo email",
                          icon: Mail,
                          description: "Nhận thông báo qua email",
                        },
                        {
                          key: "push",
                          label: "Thông báo đẩy",
                          icon: Smartphone,
                          description: "Thông báo trên thiết bị di động",
                        },
                        {
                          key: "orderUpdates",
                          label: "Cập nhật đơn hàng",
                          icon: Bell,
                          description: "Thông báo về trạng thái đơn hàng",
                        },
                        {
                          key: "promotions",
                          label: "Khuyến mãi",
                          icon: Bell,
                          description: "Thông báo về ưu đãi và khuyến mãi",
                        },
                        {
                          key: "newProducts",
                          label: "Sản phẩm mới",
                          icon: Bell,
                          description: "Thông báo về sản phẩm mới",
                        },
                      ].map((notif) => {
                        const Icon = notif.icon;
                        return (
                          <div
                            key={notif.key}
                            className="bg-gray-50/50 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 rounded-full">
                                  <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {notif.label}
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    {notif.description}
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    settings.notifications[
                                      notif.key as keyof typeof settings.notifications
                                    ]
                                  }
                                  onChange={(e) =>
                                    setSettings((prev) => ({
                                      ...prev,
                                      notifications: {
                                        ...prev.notifications,
                                        [notif.key]: e.target.checked,
                                      },
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Cài đặt bảo mật & riêng tư
                    </h2>

                    <div className="space-y-4">
                      {[
                        {
                          key: "profileVisible",
                          label: "Hiển thị hồ sơ công khai",
                          icon: Eye,
                          description: "Cho phép người khác xem hồ sơ của bạn",
                        },
                        {
                          key: "showEmail",
                          label: "Hiển thị email",
                          icon: Mail,
                          description: "Hiển thị email trong hồ sơ công khai",
                        },
                        {
                          key: "showPhone",
                          label: "Hiển thị số điện thoại",
                          icon: Smartphone,
                          description:
                            "Hiển thị số điện thoại trong hồ sơ công khai",
                        },
                        {
                          key: "dataCollection",
                          label: "Thu thập dữ liệu",
                          icon: Shield,
                          description:
                            "Cho phép thu thập dữ liệu để cải thiện dịch vụ",
                        },
                      ].map((privacy) => {
                        const Icon = privacy.icon;
                        return (
                          <div
                            key={privacy.key}
                            className="bg-gray-50/50 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 rounded-full">
                                  <Icon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {privacy.label}
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    {privacy.description}
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    settings.privacy[
                                      privacy.key as keyof typeof settings.privacy
                                    ]
                                  }
                                  onChange={(e) =>
                                    setSettings((prev) => ({
                                      ...prev,
                                      privacy: {
                                        ...prev.privacy,
                                        [privacy.key]: e.target.checked,
                                      },
                                    }))
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Account Settings */}
                {activeTab === "account" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Cài đặt tài khoản
                    </h2>

                    {/* Account Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Download className="w-5 h-5 mr-2 text-green-500" />
                          Xuất dữ liệu
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Tải xuống tất cả dữ liệu tài khoản của bạn
                        </p>
                        <button
                          onClick={handleExportData}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Xuất dữ liệu
                        </button>
                      </div>

                      <div className="bg-gray-50/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Lock className="w-5 h-5 mr-2 text-blue-500" />
                          Bảo mật tài khoản
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Quản lý mật khẩu và bảo mật
                        </p>
                        <button
                          onClick={() => router.push("/profile")}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 border border-red-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                        <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                        Vùng nguy hiểm
                      </h3>
                      <p className="text-red-700 mb-4">
                        Hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ.
                      </p>
                      <button
                        onClick={() =>
                          toast.error("Chức năng này đang được phát triển")
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa tài khoản
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-200">
                  <button
                    onClick={handleResetSettings}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Khôi phục mặc định
                  </button>

                  <button
                    onClick={handleSaveSettings}
                    disabled={isUpdating}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isUpdating ? "Đang lưu..." : "Lưu cài đặt"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
