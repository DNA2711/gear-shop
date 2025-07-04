import { NextResponse, NextRequest } from "next/server";
import { VNPay } from "vnpay";

// Cấu hình VNPay
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE || "DEMO",
  secureSecret: process.env.VNPAY_SECURE_SECRET || "DEMO_SECRET",
  vnpayHost: process.env.VNPAY_HOST || "https://sandbox.vnpayment.vn",
  testMode: true, // Đặt false khi production
});

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, orderInfo } = await request.json();

    // Validate input
    if (!orderId || !amount || !orderInfo) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Tạo URL thanh toán
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/api/vnpay/callback`;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_TxnRef: orderId,
      vnp_Amount: amount * 100, // Convert to VND (x100)
      vnp_OrderInfo: orderInfo,
      vnp_ReturnUrl: returnUrl,
    });

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
    });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL" },
      { status: 500 }
    );
  }
} 