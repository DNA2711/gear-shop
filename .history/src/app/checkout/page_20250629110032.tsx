"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import VNPayPayment from "@/components/checkout/VNPayPayment";
import { CartItem } from "@/types/cart";
import SuccessModal from "@/components/checkout/SuccessModal";
import { LoadingLink } from "@/components/ui/LoadingLink";
import { toast } from "react-hot-toast";

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  note: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, removeOrderedItems } = useCart();
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderedItems, setOrderedItems] = useState<
    { product_id: number; quantity: number }[]
  >([]);
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"vnpay">("vnpay");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load selected items from localStorage on component mount
  useEffect(() => {
    if (itemsLoaded) return; // Ngăn chạy nhiều lần

    const savedSelectedItems = localStorage.getItem("selectedCartItems");

    if (savedSelectedItems) {
      try {
        const parsedItems = JSON.parse(savedSelectedItems);
        setSelectedItems(parsedItems);
        setItemsLoaded(true);
        // Chỉ xóa localStorage sau khi đã set state thành công
        setTimeout(() => {
          localStorage.removeItem("selectedCartItems");
        }, 100);
      } catch (error) {
        console.error("Error parsing selected items:", error);
        setItemsLoaded(true);
        router.push("/cart");
      }
    } else {
      setItemsLoaded(true);
      router.push("/cart");
    }
  }, [router, itemsLoaded]);

  useEffect(() => {
    // Simulate loading for checkout initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only redirect to login after a delay to avoid conflicts
    if (!user) {
      console.log("User not found, will redirect to login");
      const timer = setTimeout(() => {
        router.push("/login?redirect=/checkout");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      console.log("User found:", user);
      // Pre-fill form with user data if available
      if (user.name) {
        setFormData((prev) => ({
          ...prev,
          fullName: user.name || "",
          email: user.email || "",
          phone: (user as any).phone_number || "",
        }));
      }
    }
  }, [user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Phone input handler với validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số
    const numbersOnly = value.replace(/\D/g, "");
    // Giới hạn tối đa 10 số
    const limitedNumbers = numbersOnly.slice(0, 10);

    setFormData({
      ...formData,
      phone: limitedNumbers,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit called");
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.phone || !formData.address) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      // Validate phone number - must be exactly 10 digits
      if (formData.phone.length !== 10) {
        toast.error("Số điện thoại phải có đúng 10 số");
        return;
      }

      // Validate phone number - must contain only numbers
      if (!/^\d{10}$/.test(formData.phone)) {
        toast.error("Số điện thoại chỉ được chứa số");
        return;
      }

      // Check if cart has items
      if (!cart.items || cart.items.length === 0) {
        toast.error(
          "Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng."
        );
        return;
      }

      // Prepare order data with selected items only
      console.log("Selected items:", selectedItems);
      const orderItems = selectedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      console.log("Order items:", orderItems);

      const orderData = {
        shipping_address: `${formData.address}, ${formData.city}`,
        phone_number: formData.phone,
        payment_method: paymentMethod,
        items: orderItems,
      };

      // Store ordered items for later removal from cart
      setOrderedItems(orderItems);

      // Create order via API
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      setOrderId(result.orderId.toString());

      // Handle different payment methods
      if (paymentMethod === "vnpay") {
        // For VNPay, show QR code for payment
        console.log("VNPay order created, showing QR code for payment");
        setShowQRCode(true);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      console.log("Payment success - updating cart and redirecting...");

      // Remove only ordered items from cart (not everything)
      if (orderedItems.length > 0) {
        await removeOrderedItems(orderedItems);
      }

      // Show success modal instead of alert
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error processing payment success:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Calculate total amount for selected items only
  const totalAmount = selectedItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Form Skeleton */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method Skeleton */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-4 border rounded-lg animate-pulse"
                      >
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary Skeleton */}
              <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-6"></div>

                {/* Cart Items Skeleton */}
                <div className="space-y-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 animate-pulse"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>

                {/* Total Skeleton */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>

                <div className="h-12 bg-gray-200 rounded w-full mt-6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            Đang chuyển hướng đến trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng trống
          </h1>
          <p className="text-gray-600 mb-6">
            Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán.
          </p>
          <LoadingLink
            href="/products"
            loadingMessage="Đang chuyển đến cửa hàng..."
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </LoadingLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thanh toán
            </h1>
            <p className="text-gray-600">Hoàn tất thông tin để đặt hàng</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <Truck className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông tin giao hàng
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Số điện thoại * ({formData.phone.length}/10)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formData.phone.length === 0
                            ? "border-gray-300 focus:ring-blue-500"
                            : formData.phone.length === 10
                            ? "border-green-300 focus:ring-green-500 bg-green-50"
                            : "border-orange-300 focus:ring-orange-500 bg-orange-50"
                        }`}
                        placeholder="Nhập số điện thoại (10 số)"
                      />
                      {formData.phone.length > 0 &&
                        formData.phone.length < 10 && (
                          <p className="mt-1 text-sm text-orange-600">
                            Cần thêm {10 - formData.phone.length} số nữa
                          </p>
                        )}
                      {formData.phone.length === 10 && (
                        <p className="mt-1 text-sm text-green-600">
                          ✓ Số điện thoại hợp lệ
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Địa chỉ giao hàng *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập địa chỉ đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố *
                      </label>
                      <select
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="danang">Đà Nẵng</option>
                        <option value="haiphong">Hải Phòng</option>
                        <option value="cantho">Cần Thơ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện *
                      </label>
                      <select
                        id="district"
                        name="district"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn quận/huyện</option>
                        <option value="district1">Quận 1</option>
                        <option value="district2">Quận 2</option>
                        <option value="district3">Quận 3</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phường/Xã *
                      </label>
                      <select
                        id="ward"
                        name="ward"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn phường/xã</option>
                        <option value="ward1">Phường 1</option>
                        <option value="ward2">Phường 2</option>
                        <option value="ward3">Phường 3</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="note"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Ghi chú đặc biệt
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Phương thức thanh toán
                  </h2>
                </div>

                <div className="space-y-4">
                  <label
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      paymentMethod === "vnpay"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "vnpay")
                      }
                      className="text-blue-600"
                    />
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-medium">VNPay</div>
                      <div className="text-sm text-gray-500">
                        Thanh toán online qua VNPay
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">
                      Thanh toán an toàn & bảo mật
                    </h3>
                    <p className="text-sm text-blue-700">
                      Thông tin của bạn được mã hóa và bảo vệ bởi SSL 256-bit.
                      Chúng tôi không lưu trữ thông tin thẻ tín dụng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Đơn hàng của bạn
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center space-x-3"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.primary_image && (
                          <img
                            src={item.primary_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.jpg";
                            }}
                          />
                        )}
                      </div>
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product_name}
                      </h4>
                      <p className="text-sm text-gray-500 price-text">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900 price-text">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuế VAT:</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-lg font-bold text-gray-900 price-text">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Phương thức thanh toán:</span>
                  <span className="ml-2">
                    {paymentMethod === "vnpay" ? "💳 VNPay" : "VNPay"}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || orderLoading}
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative px-6 py-4 flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        <span className="font-bold text-lg">Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-white/20 rounded-full">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-lg">
                              Thanh toán VNPay
                            </div>
                            <div className="text-sm opacity-90">
                              {formatPrice(totalAmount)}
                            </div>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <svg
                            className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Bảo mật 256-bit SSL</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Giao hàng trong 2-3 ngày làm việc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VNPay Payment Modal */}
      {showQRCode && orderId && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full relative">
            {/* Close button */}
            <button
              onClick={() => setShowQRCode(false)}
              className="absolute -top-4 -right-4 bg-white text-gray-600 hover:text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10 border border-gray-200"
            >
              ✕
            </button>
            <VNPayPayment
              orderId={orderId}
              amount={totalAmount}
              orderInfo={`Thanh toán đơn hàng #${orderId}`}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      )}

      {/* Add SuccessModal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/orders");
        }}
        orderId={orderId}
      />
    </div>
  );
}
