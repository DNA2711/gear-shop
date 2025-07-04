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
    <div className="min-h-screen seamless-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card-prominent rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-on-glass">
                Thông tin cá nhân
              </h1>
              <button
                onClick={() => router.push("/settings")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg"
              >
                Cài đặt
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-on-glass">
                      {user?.name}
                    </h2>
                    <p className="text-secondary-glass">{user?.email}</p>
                    <p className="text-muted-glass">
                      Thành viên từ {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-on-glass mb-4">
                      Thông tin cơ bản
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-glass mb-1">
                          Tên đầy đủ
                        </label>
                        <p className="text-on-glass font-medium">{user?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-glass mb-1">
                          Email
                        </label>
                        <p className="text-on-glass font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-glass mb-1">
                          Số điện thoại
                        </label>
                        <p className="text-on-glass font-medium">
                          {user?.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-on-glass mb-4">
                      Địa chỉ
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-glass mb-1">
                        <label className="text-white/70 text-sm">Địa chỉ</label>
                        <p className="text-white font-medium">
                          {user.address || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">
                          Thành phố
                        </label>
                        <p className="text-white font-medium">
                          {user.address || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div>
                        <label className="text-white/70 text-sm">
                          Mã bưu điện
                        </label>
                        <p className="text-white font-medium">
                          {"Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Thống kê tài khoản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">12</div>
                      <div className="text-white/70 text-sm">Đơn hàng</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">8</div>
                      <div className="text-white/70 text-sm">Hoàn thành</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        2
                      </div>
                      <div className="text-white/70 text-sm">Đang xử lý</div>
                    </div>
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
