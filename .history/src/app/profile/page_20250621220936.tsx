"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Lock,
  Calendar,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { getUserDisplayName } from "@/utils/userUtils";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  address: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateProfile = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    }

    if (profileData.phoneNumber && profileData.phoneNumber.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(profileData.phoneNumber.replace(/[\s-]/g, ""))) {
        newErrors.phoneNumber = "Số điện thoại phải có 10-11 chữ số";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfile()) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        toast.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
        // Reload user data
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối. Vui lòng thử lại.");
      console.error("Update profile error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      if (response.ok) {
        toast.success("Đổi mật khẩu thành công!");
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối. Vui lòng thử lại.");
      console.error("Change password error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getRoleText = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Quản trị viên";
      case "staff":
        return "Nhân viên";
      case "customer":
      default:
        return "Khách hàng";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "customer":
      default:
        return "bg-green-100 text-green-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 relative overflow-hidden">
          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <UserAvatar user={user} size="lg" showStatus />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {getUserDisplayName(user)}
                </h1>
                <p className="text-gray-600 text-lg mt-1">{user.email}</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 shadow-sm whitespace-nowrap ${getRoleColor(
                    user.role
                  )}`}
                >
                  <Shield className="w-4 h-4 mr-1" />
                  {getRoleText(user.role)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-white/20 group-hover:-rotate-180 ease"></span>
                  <Edit3 className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Chỉnh sửa</span>
                </button>
              )}

              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-100/50 group-hover:-rotate-180 ease"></span>
                <Lock className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10">Đổi mật khẩu</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 via-transparent to-purple-600/3"></div>

              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 relative z-10">
                <User className="w-6 h-6 inline mr-2 text-blue-600" />
                Thông tin cá nhân
              </h2>

              {isEditing ? (
                <div className="space-y-8 relative z-10">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200">
                      Họ và tên *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                          errors.fullName
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                        }`}
                        placeholder="Nhập họ và tên của bạn"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl bg-gray-50/80 text-gray-500 backdrop-blur-sm"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      Email không thể thay đổi
                    </p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleProfileChange}
                        className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                          errors.phoneNumber
                            ? "border-red-500 focus:border-red-500"
                            : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                        }`}
                        placeholder="Nhập số điện thoại"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-blue-600 transition-colors duration-200">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        rows={3}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Nhập địa chỉ của bạn"
                      />
                      <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({});
                        // Reset form data
                        if (user) {
                          setProfileData({
                            fullName: user.name || "",
                            phoneNumber: user.phoneNumber || "",
                            address: user.address || "",
                          });
                        }
                      }}
                      className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      disabled={isUpdating}
                    >
                      <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-100/50 group-hover:-rotate-180 ease"></span>
                      <X className="w-4 h-4 mr-2 relative z-10" />
                      <span className="relative z-10">Hủy</span>
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-xl hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-white/20 group-hover:-rotate-180 ease"></span>
                      {isUpdating ? (
                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full relative z-10"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2 relative z-10" />
                      )}
                      <span className="relative z-10">
                        {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 relative z-10">
                  <div className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 p-4 rounded-xl transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">
                          Họ và tên
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.name || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 p-4 rounded-xl transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">
                          Email
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 p-4 rounded-xl transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                        <Phone className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">
                          Số điện thoại
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 p-4 rounded-xl transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
                        <MapPin className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">
                          Địa chỉ
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.address || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/3 via-transparent to-pink-600/3"></div>

              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 relative z-10">
                <Shield className="w-6 h-6 inline mr-2 text-purple-600" />
                Thông tin tài khoản
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="group hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 p-4 rounded-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 mb-1">
                        Ngày tham gia
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.createdAt
                          ? formatDate(user.createdAt)
                          : "Không rõ"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 p-4 rounded-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 mb-1">
                        Vai trò
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm whitespace-nowrap ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleText(user.role)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 p-4 rounded-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 mb-1">
                        Trạng thái
                      </p>
                      <p className="text-lg font-medium text-green-600">
                        Hoạt động
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 w-full max-w-md relative overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-orange-600/5"></div>

            {/* Header */}
            <div className="relative z-10 p-8 pb-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  <Lock className="w-6 h-6 inline mr-2 text-red-600" />
                  Đổi mật khẩu
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setErrors({});
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  disabled={isUpdating}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để thay đổi.
              </p>
            </div>

            {/* Form */}
            <div className="relative z-10 p-8 space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-red-600 transition-colors duration-200">
                  Mật khẩu hiện tại *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    autoComplete="off"
                    data-form-type="other"
                    data-lpignore="true"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                      errors.currentPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500 hover:border-gray-300"
                    }`}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-red-600 transition-colors duration-200">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="off"
                    data-form-type="other"
                    data-lpignore="true"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                      errors.newPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500 hover:border-gray-300"
                    }`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 group-focus-within:text-red-600 transition-colors duration-200">
                  Xác nhận mật khẩu mới *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="off"
                    data-form-type="other"
                    data-lpignore="true"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-red-500 hover:border-gray-300"
                    }`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setErrors({});
                  }}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isUpdating}
                  className="group relative inline-flex items-center px-6 py-3 overflow-hidden text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-xl hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-white/20 group-hover:-rotate-180 ease"></span>
                  {isUpdating ? (
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full relative z-10"></div>
                  ) : (
                    <Lock className="w-4 h-4 mr-2 relative z-10" />
                  )}
                  <span className="relative z-10">
                    {isUpdating ? "Đang đổi..." : "Đổi mật khẩu"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
