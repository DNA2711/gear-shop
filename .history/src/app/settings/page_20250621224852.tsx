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
  ChevronDown,
  Check,
  Monitor,
  Palette,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
  const { theme, setTheme } = useTheme();
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
              <nav className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group relative w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-blue-500/25"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-700 hover:shadow-lg"
                      }`}
                    >
                      {/* Glowing border effect when active */}
                      {activeTab === tab.id && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-75 blur-sm -z-10 animate-pulse"></div>
                      )}

                      {/* Hover glow effect for inactive tabs */}
                      {activeTab !== tab.id && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200/0 via-purple-200/0 to-pink-200/0 group-hover:from-blue-200/20 group-hover:via-purple-200/20 group-hover:to-pink-200/20 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                      )}

                      <div
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? "bg-white/20 backdrop-blur-sm shadow-lg"
                            : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-purple-100 group-hover:scale-110"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 transition-all duration-300 ${
                            activeTab === tab.id
                              ? "text-white"
                              : "text-gray-600 group-hover:text-blue-600"
                          }`}
                        />
                      </div>

                      <span
                        className={`ml-4 font-semibold text-lg transition-all duration-300 ${
                          activeTab === tab.id
                            ? "text-white"
                            : "text-gray-700 group-hover:text-blue-700"
                        }`}
                      >
                        {tab.name}
                      </span>

                      {/* Active indicator */}
                      {activeTab === tab.id && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          <div className="w-2 h-2 bg-white rounded-full absolute right-5"></div>
                        </div>
                      )}

                      {/* Hover arrow for inactive tabs */}
                      {activeTab !== tab.id && (
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                        </div>
                      )}
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
                  <div className="space-y-8">
                    <div className="text-center pb-6 border-b border-gradient-to-r from-transparent via-gray-200 to-transparent">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Cài đặt tổng quan
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Tùy chỉnh ngôn ngữ và tiền tệ theo sở thích
                      </p>
                    </div>

                    {/* Enhanced Theme, Language & Currency Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {/* Theme Card */}
                      <div className="group relative bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-200/30 hover:border-purple-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative">
                          <div className="flex items-center mb-6">
                            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                              <Palette className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                Giao diện
                              </h3>
                              <p className="text-gray-600">
                                Chế độ hiển thị
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <ThemeToggle />
                          </div>
                          
                          <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                              {theme === "light" && "Chế độ sáng"}
                              {theme === "dark" && "Chế độ tối"}
                              {theme === "system" && "Theo hệ thống"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Language Card */}
                      <div className="group relative bg-gradient-to-br from-blue-50/50 to-cyan-50/50 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative">
                          <div className="flex items-center mb-6">
                            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                              <Globe className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                Ngôn ngữ
                              </h3>
                              <p className="text-gray-600">
                                Chọn ngôn ngữ hiển thị
                              </p>
                            </div>
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => setLanguageOpen(!languageOpen)}
                              className="w-full px-6 py-4 text-lg font-medium bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-between"
                            >
                              <span className="flex items-center">
                                <span className="mr-3 text-2xl">
                                  {settings.language === "vi" ? "🇻🇳" : "🇺🇸"}
                                </span>
                                {settings.language === "vi"
                                  ? "Tiếng Việt"
                                  : "English"}
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-blue-500 transition-transform duration-200 ${
                                  languageOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {languageOpen && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                {[
                                  {
                                    value: "vi",
                                    label: "Tiếng Việt",
                                    flag: "🇻🇳",
                                  },
                                  { value: "en", label: "English", flag: "🇺🇸" },
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setSettings((prev) => ({
                                        ...prev,
                                        language: option.value,
                                      }));
                                      setLanguageOpen(false);
                                    }}
                                    className="w-full px-6 py-4 text-left hover:bg-blue-50/80 transition-colors duration-200 flex items-center justify-between group"
                                  >
                                    <span className="flex items-center">
                                      <span className="mr-3 text-2xl">
                                        {option.flag}
                                      </span>
                                      <span className="text-lg font-medium text-gray-900 group-hover:text-blue-700">
                                        {option.label}
                                      </span>
                                    </span>
                                    {settings.language === option.value && (
                                      <Check className="w-5 h-5 text-blue-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Currency Card */}
                      <div className="group relative bg-gradient-to-br from-emerald-50/50 to-teal-50/50 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/30 hover:border-emerald-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative">
                          <div className="flex items-center mb-6">
                            <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                              <span className="text-2xl">💰</span>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                Tiền tệ
                              </h3>
                              <p className="text-gray-600">
                                Đơn vị tiền tệ ưa thích
                              </p>
                            </div>
                          </div>

                          <div className="relative">
                            <button
                              onClick={() => setCurrencyOpen(!currencyOpen)}
                              className="w-full px-6 py-4 text-lg font-medium bg-white/90 backdrop-blur-sm border-2 border-emerald-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-between"
                            >
                              <span className="flex items-center">
                                <span className="mr-3 text-2xl">
                                  {settings.currency === "VND" ? "🇻🇳" : "🇺🇸"}
                                </span>
                                <span>
                                  {settings.currency === "VND"
                                    ? "VND (₫)"
                                    : "USD ($)"}
                                </span>
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-emerald-500 transition-transform duration-200 ${
                                  currencyOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {currencyOpen && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                {[
                                  {
                                    value: "VND",
                                    label: "VND (₫)",
                                    flag: "🇻🇳",
                                  },
                                  {
                                    value: "USD",
                                    label: "USD ($)",
                                    flag: "🇺🇸",
                                  },
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setSettings((prev) => ({
                                        ...prev,
                                        currency: option.value,
                                      }));
                                      setCurrencyOpen(false);
                                    }}
                                    className="w-full px-6 py-4 text-left hover:bg-emerald-50/80 transition-colors duration-200 flex items-center justify-between group"
                                  >
                                    <span className="flex items-center">
                                      <span className="mr-3 text-2xl">
                                        {option.flag}
                                      </span>
                                      <span className="text-lg font-medium text-gray-900 group-hover:text-emerald-700">
                                        {option.label}
                                      </span>
                                    </span>
                                    {settings.currency === option.value && (
                                      <Check className="w-5 h-5 text-emerald-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-violet-600 font-semibold">
                              Thành viên từ
                            </p>
                            <p className="text-xl font-bold text-violet-900">
                              {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                    "vi-VN"
                                  )
                                : "Không rõ"}
                            </p>
                          </div>
                          <div className="p-3 bg-violet-500 rounded-xl">
                            <span className="text-white text-xl">📅</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-cyan-600 font-semibold">
                              Vai trò tài khoản
                            </p>
                            <p className="text-xl font-bold text-cyan-900">
                              {user?.role === "admin"
                                ? "Quản trị viên"
                                : "Khách hàng"}
                            </p>
                          </div>
                          <div className="p-3 bg-cyan-500 rounded-xl">
                            <span className="text-white text-xl">👤</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-8">
                    <div className="text-center pb-6 border-b border-gradient-to-r from-transparent via-gray-200 to-transparent">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Cài đặt thông báo
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Quản lý các loại thông báo bạn muốn nhận
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {[
                        {
                          key: "email",
                          label: "Thông báo email",
                          icon: Mail,
                          description: "Nhận thông báo qua email",
                          color: "from-blue-500 to-cyan-500",
                          bgColor: "from-blue-50/50 to-cyan-50/50",
                        },
                        {
                          key: "push",
                          label: "Thông báo đẩy",
                          icon: Smartphone,
                          description: "Thông báo trên thiết bị di động",
                          color: "from-purple-500 to-pink-500",
                          bgColor: "from-purple-50/50 to-pink-50/50",
                        },
                        {
                          key: "orderUpdates",
                          label: "Cập nhật đơn hàng",
                          icon: Bell,
                          description: "Thông báo về trạng thái đơn hàng",
                          color: "from-emerald-500 to-teal-500",
                          bgColor: "from-emerald-50/50 to-teal-50/50",
                        },
                        {
                          key: "promotions",
                          label: "Khuyến mãi",
                          icon: Bell,
                          description: "Thông báo về ưu đãi và khuyến mãi",
                          color: "from-orange-500 to-red-500",
                          bgColor: "from-orange-50/50 to-red-50/50",
                        },
                        {
                          key: "newProducts",
                          label: "Sản phẩm mới",
                          icon: Bell,
                          description: "Thông báo về sản phẩm mới",
                          color: "from-violet-500 to-purple-500",
                          bgColor: "from-violet-50/50 to-purple-50/50",
                        },
                      ].map((notif) => {
                        const Icon = notif.icon;
                        const isEnabled =
                          settings.notifications[
                            notif.key as keyof typeof settings.notifications
                          ];
                        return (
                          <div
                            key={notif.key}
                            className={`group relative bg-gradient-to-br ${
                              notif.bgColor
                            } backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 hover:border-gray-300/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                              isEnabled ? "ring-2 ring-blue-500/20" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`p-4 bg-gradient-to-r ${notif.color} rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                                >
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {notif.label}
                                  </h3>
                                  <p className="text-gray-600">
                                    {notif.description}
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isEnabled}
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
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer transition-all duration-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 shadow-lg"></div>
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
