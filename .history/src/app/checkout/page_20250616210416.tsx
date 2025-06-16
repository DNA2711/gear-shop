"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import VNPayQRCode from "@/components/checkout/VNPayQRCode";
import { CartItem } from "@/types/cart";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

      // Create order via API (order will be created with 'paid' status)
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

      // Remove ordered items from cart immediately
      if (orderItems.length > 0) {
        await removeOrderedItems(orderItems);
      }

      // Show success message
      alert("🎉 Đặt hàng thành công! Đơn hàng của bạn đã được xử lý.");

      // Redirect to orders page to see the order
      router.push("/orders");
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

      // Show success message
      alert("🎉 Thanh toán thành công! Đơn hàng của bạn đã được xử lý.");

      // Redirect to orders page to see the order
      router.push("/orders");
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

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Không có sản phẩm nào được chọn
            </h1>
            <p className="text-gray-600 mb-8">
              Vui lòng quay lại giỏ hàng và chọn sản phẩm để thanh toán.
            </p>
            <Link
              href="/cart"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Thông tin thanh toán
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin cá nhân
                </h2>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Địa chỉ giao hàng
                </h2>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Thành phố
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {isSubmitting ? "Đang xử lý..." : "🛒 Đặt hàng ngay"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Đơn hàng của bạn
            </h2>

            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between py-4 border-b border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.primary_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium text-gray-900">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900">Tổng cộng</span>
                <span className="text-blue-600">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
