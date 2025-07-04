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
    const data = await request.json();
    console.log("Received payment request data:", data);

    const { orderId, amount, orderInfo } = data;

    // Validate input
    if (!orderId || !amount || !orderInfo) {
      console.error("Missing required parameters:", { orderId, amount, orderInfo });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Chuyển đổi orderId thành string nếu là number
    const orderIdStr = orderId.toString();
    
    // Đảm bảo amount là số
    const amountNum = Number(amount);
    if (isNaN(amountNum)) {
      console.error("Invalid amount format:", amount);
      return NextResponse.json(
        { error: "Amount must be a number" },
        { status: 400 }
      );
    }

    // Tạo URL thanh toán
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/api/vnpay/callback`;

    console.log("Creating payment URL with params:", {
      vnp_TxnRef: orderIdStr,
      vnp_Amount: amountNum * 100,
      vnp_OrderInfo: orderInfo,
      vnp_ReturnUrl: returnUrl,
    });

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_TxnRef: orderIdStr,
      vnp_Amount: amountNum * 100, // Convert to VND (x100)
      vnp_OrderInfo: orderInfo,
      vnp_ReturnUrl: returnUrl,
    });

    console.log("Generated payment URL:", paymentUrl);

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId: orderIdStr,
    });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL", details: error.message },
      { status: 500 }
    );
  }
} 