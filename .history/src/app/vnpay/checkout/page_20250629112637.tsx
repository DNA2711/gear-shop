"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VNPayMockCheckout() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const orderInfo = searchParams.get("orderInfo");

  const [selectedMethod, setSelectedMethod] = useState("ATM");
  const [processing, setProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // Form states for card input
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bankPassword, setBankPassword] = useState("");

  // ATM card form states
  const [atmCardNumber, setAtmCardNumber] = useState("");
  const [atmPassword, setAtmPassword] = useState("");

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Validate card input based on method
      if (selectedMethod === "ATM") {
        if (!atmCardNumber || !atmPassword) {
          alert("Vui lòng nhập đầy đủ thông tin thẻ ATM");
          setProcessing(false);
          return;
        }
      } else if (selectedMethod === "VISA") {
        if (!cardNumber || !cardHolder || !expiry || !cvv) {
          alert("Vui lòng nhập đầy đủ thông tin thẻ");
          setProcessing(false);
          return;
        }
      }

      // Simulate VNPay processing time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate success rate (95% success for realistic experience)
      const success = Math.random() > 0.05;

      if (success) {
        // Simulate payment success - update order status
        await fetch("/api/vnpay/simulate-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            status: "paid",
          }),
        });

        // Redirect to success page
        router.push(
          `/checkout/success?orderId=${orderId}&from=vnpay&status=success`
        );
      } else {
        // Redirect to failed page (rare case)
        router.push(
          `/checkout/success?orderId=${orderId}&from=vnpay&status=failed`
        );
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      router.push(
        `/checkout/success?orderId=${orderId}&from=vnpay&status=failed`
      );
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const formatAmount = (amount: string) => {
    return Number(amount).toLocaleString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header giống VNPay */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">VN</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Cổng thanh toán VNPay
                </h1>
                <p className="text-sm text-gray-600">
                  Thanh toán an toàn & bảo mật
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="text-sm font-medium">Bảo mật SSL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Payment Info */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-4">Thông tin thanh toán</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-blue-100 text-sm">Mã đơn hàng</p>
                <p className="text-xl font-semibold">#{orderId}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Số tiền</p>
                <p className="text-3xl font-bold">
                  {amount && formatAmount(amount)} VNĐ
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-blue-100 text-sm">Nội dung thanh toán</p>
                <p className="text-lg">{orderInfo}</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Chọn phương thức thanh toán
            </h3>

            <div className="space-y-4">
              {/* ATM Card */}
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedMethod === "ATM"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMethod("ATM")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏧</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Thẻ ATM nội địa
                      </p>
                      <p className="text-sm text-gray-600">
                        Vietcombank, Techcombank, BIDV, ACB...
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === "ATM"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "ATM" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Credit Card */}
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedMethod === "VISA"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMethod("VISA")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Thẻ quốc tế</p>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, JCB...
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === "VISA"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "VISA" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedMethod === "QR"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMethod("QR")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Ví điện tử QR
                      </p>
                      <p className="text-sm text-gray-600">
                        VNPay QR, ZaloPay, MomoPay...
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === "QR"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMethod === "QR" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Input Forms */}
            {selectedMethod === "ATM" && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin thẻ ATM
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số thẻ ATM *
                    </label>
                    <input
                      type="text"
                      value={atmCardNumber}
                      onChange={(e) => setAtmCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Test: 9704 1985 2619 1432 (Vietcombank)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu Internet Banking *
                    </label>
                    <input
                      type="password"
                      value={atmPassword}
                      onChange={(e) => setAtmPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Test: 123456
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "VISA" && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Thông tin thẻ thanh toán
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số thẻ *
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4000 0000 0000 0002"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Test: 4000 0000 0000 0002 (Visa)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên chủ thẻ *
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="NGUYEN VAN A"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày hết hạn *
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="12/25"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === "QR" && (
              <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-64 h-64 bg-white rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📱</div>
                    <p className="text-gray-600">QR Code sẽ hiển thị ở đây</p>
                    <p className="text-sm text-gray-500 mt-2">Quét bằng ứng dụng ngân hàng</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">Hỗ trợ các ứng dụng:</p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>VNPay QR</span>
                    <span>•</span>
                    <span>ZaloPay</span>
                    <span>•</span>
                    <span>MomoPay</span>
                    <span>•</span>
                    <span>ShopeePay</span>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1L5 6v3.09c0 2.85 1.4 5.41 3.55 6.73L10 17l1.45-1.18C13.6 14.5 15 11.94 15 9.09V6l-5-5zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd"></path>
                </svg>
                <div>
                  <h5 className="font-semibold text-green-800 mb-1">Bảo mật thông tin</h5>
                  <p className="text-sm text-green-700">
                    Thông tin thẻ của bạn được mã hóa và bảo mật tuyệt đối. 
                    VNPay không lưu trữ thông tin thẻ sau khi giao dịch hoàn tất.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-8">
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Đang xử lý thanh toán...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🔒</span>
                    Thanh toán {amount && formatAmount(amount)} VNĐ
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
