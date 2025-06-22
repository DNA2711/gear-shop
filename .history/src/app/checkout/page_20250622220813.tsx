"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
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
import VNPayQRCode from "@/components/checkout/VNPayQRCode";
import { CartItem } from "@/types/cart";
import SuccessModal from "@/components/checkout/SuccessModal";
import { LoadingLink } from "@/components/ui/LoadingLink";

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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  // Load selected items from localStorage on component mount
  useEffect(() => {
    const savedSelectedItems = localStorage.getItem("selectedCartItems");
    if (savedSelectedItems) {
      try {
        const parsedItems = JSON.parse(savedSelectedItems);
        setSelectedItems(parsedItems);
        // Clean up localStorage after loading
        localStorage.removeItem("selectedCartItems");
      } catch (error) {
        console.error("Error parsing selected items:", error);
        // If no selected items or error, redirect back to cart
        router.push("/cart");
      }
    } else {
      // If no selected items, redirect back to cart
      router.push("/cart");
    }
  }, [router]);

  useEffect(() => {
    // Simulate loading for checkout initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.address ||
        !formData.city
      ) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      // Prepare order data with selected items only
      const orderItems = selectedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

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
      if (paymentMethod === "cod") {
        // For COD, order is complete, go directly to success
        console.log("COD order created successfully, going to success");
        handlePaymentSuccess();
      } else if (paymentMethod === "vnpay") {
        // For VNPay, show QR code for payment
        console.log("VNPay order created, showing QR code for payment");
        setShowQRCode(true);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
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
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập số điện thoại"
                      />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows={2}
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 mr-2" />
                        Đặt hàng • {formatPrice(totalAmount)}
                      </>
                    )}
                  </button>
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
                      paymentMethod === "cod"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as "cod" | "vnpay")
                      }
                      className="text-blue-600"
                    />
                    <Truck className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium">
                        Thanh toán khi nhận hàng
                      </div>
                      <div className="text-sm text-gray-500">
                        Thanh toán bằng tiền mặt khi nhận hàng
                      </div>
                    </div>
                  </label>

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
                        setPaymentMethod(e.target.value as "cod" | "vnpay")
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
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
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
                    <span className="text-lg font-bold text-gray-900">
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
                    {paymentMethod === "cod" ? "💰 Thanh toán khi nhận hàng" : "💳 VNPay (QR Code)"}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleSubmit}
                disabled={orderLoading || !isSubmitting}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {orderLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {paymentMethod === "cod" ? (
                      <>
                        <Truck className="w-4 h-4 mr-2" />
                        Đặt hàng • {formatPrice(totalAmount)}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Thanh toán VNPay • {formatPrice(totalAmount)}
                      </>
                    )}
                  </>
                )}
              </button>

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

      {/* VNPay QR Code Modal */}
      {showQRCode && orderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <VNPayQRCode
              orderId={orderId}
              amount={totalAmount}
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
