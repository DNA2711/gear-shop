import { NextResponse, NextRequest } from "next/server";
import { VNPay } from "vnpay";
import crypto from "crypto";

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
    
    // Đảm bảo amount là số và chuyển đổi sang số nguyên
    const amountNum = Math.round(Number(amount));
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

    // Tạo các tham số bắt buộc cho VNPAY
    const tmnCode = process.env.VNPAY_TMN_CODE || "DEMO";
    const createDate = new Date().toISOString().replace(/[-T:]/g, "").slice(0, 14);
    const currCode = "VND";
    const locale = "vn";
    const vnpVersion = "2.1.0";

    const vnpParams = {
      vnp_Version: vnpVersion,
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderIdStr,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: amountNum * 100, // Convert to VND (x100)
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    console.log("Creating payment URL with params:", vnpParams);

    const paymentUrl = vnpay.buildPaymentUrl(vnpParams);
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