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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
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
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UserAvatar user={user} size="lg" showStatus />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getUserDisplayName(user)}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                    user.role
                  )}`}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {getRoleText(user.role)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </button>
              )}
              
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" />
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Thông tin cá nhân
              </h2>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập họ và tên của bạn"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email không thể thay đổi
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phoneNumber ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
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
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      Hủy
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                      <p className="text-gray-900">
                        {user.name || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                      <p className="text-gray-900">
                        {user.phoneNumber || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                      <p className="text-gray-900">
                        {user.address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin tài khoản
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ngày tham gia</p>
                    <p className="text-gray-900">
                      {user.createdAt ? formatDate(user.createdAt) : "Không rõ"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vai trò</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleText(user.role)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                    <p className="text-green-600 font-medium">Hoạt động</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            {showPasswordForm && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Đổi mật khẩu
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.currentPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.newPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

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
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      disabled={isUpdating}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={isUpdating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Lock className="w-4 h-4 mr-2" />
                      )}
                      {isUpdating ? "Đang đổi..." : "Đổi mật khẩu"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 