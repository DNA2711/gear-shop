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
      // Prepare order data with selected items only
      const orderItems = selectedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const orderData = {
        shipping_address: `${formData.address}, ${formData.city}`,
        phone_number: formData.phone,
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
      setShowQRCode(true);
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
      <div className="min-h-screen seamless-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Thanh toán
                </h1>
                <p className="text-white/70">Hoàn tất đơn hàng của bạn</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Tóm tắt đơn hàng
                  </h2>

                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={item.image_url || "/images/default-product.jpg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-medium">
                            {item.name}
                          </h3>
                          <p className="text-white/70 text-sm">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VND
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">Tạm tính:</span>
                      <span className="text-white">
                        {totalAmount.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">Phí vận chuyển:</span>
                      <span className="text-white">{formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white/70">Thuế:</span>
                      <span className="text-white">{formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-white">Tổng cộng:</span>
                      <span className="text-blue-400">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Thông tin thanh toán
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Địa chỉ giao hàng
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        required
                        rows={3}
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-none"
                        placeholder="Nhập địa chỉ giao hàng"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Phương thức thanh toán
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={true}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10"
                          />
                          <span className="ml-2 text-white">
                            Thanh toán khi nhận hàng (COD)
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="payment"
                            value="vnpay"
                            checked={true}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10"
                          />
                          <span className="ml-2 text-white">VNPay</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                      >
                        {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen seamless-background flex items-center justify-center">
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
      <div className="min-h-screen seamless-background flex items-center justify-center">
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
    <div className="min-h-screen seamless-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Thanh toán</h1>
              <p className="text-white/70">Hoàn tất đơn hàng của bạn</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image_url || "/images/default-product.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-white/70 text-sm">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                          VND
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">Tạm tính:</span>
                    <span className="text-white">
                      {totalAmount.toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">Phí vận chuyển:</span>
                    <span className="text-white">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/70">Thuế:</span>
                    <span className="text-white">{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-white">Tổng cộng:</span>
                    <span className="text-blue-400">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Thông tin thanh toán
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-none"
                      placeholder="Nhập địa chỉ giao hàng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Phương thức thanh toán
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10"
                        />
                        <span className="ml-2 text-white">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="vnpay"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 bg-white/10"
                        />
                        <span className="ml-2 text-white">VNPay</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

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
