import { NextResponse, NextRequest } from "next/server";
import { VNPay } from "vnpay";

// Cấu hình VNPay
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE || "DEMO",
  secureSecret: process.env.VNPAY_SECURE_SECRET || "DEMO_SECRET",
  vnpayHost: process.env.VNPAY_HOST || "https://sandbox.vnpayment.vn",
  testMode: process.env.NODE_ENV !== "production",
  hashAlgorithm: "SHA512",
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

    // Chuyển đổi amount thành số và làm tròn
    const numAmount = Math.round(Number(amount));
    if (isNaN(numAmount)) {
      console.error("Invalid amount format:", amount);
      return NextResponse.json(
        { error: "Amount must be a number" },
        { status: 400 }
      );
    }

    // Kiểm tra giới hạn số tiền theo yêu cầu của VNPAY
    if (numAmount < 5000 || numAmount >= 1000000000) {
      console.error("Invalid amount range:", {
        originalAmount: amount,
        numAmount
      });
      return NextResponse.json(
        { error: "Số tiền giao dịch không hợp lệ. Số tiền hợp lệ từ 5,000 đến dưới 1 tỷ đồng" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const createDate = new Date().toISOString().replace(/[-T:]/g, "").slice(0, 14);
    
    console.log("Payment details:", {
      originalAmount: amount,
      numAmount: numAmount,
      formattedAmount: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numAmount)
    });

    // Xác định returnUrl dựa vào môi trường
    const returnUrl = process.env.NODE_ENV === "production"
      ? `${baseUrl}/api/vnpay/callback`
      : `${baseUrl}/checkout/success?orderId=${orderId}&from=vnpay`;

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: process.env.VNPAY_TMN_CODE || "DEMO",
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: numAmount,
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
      orderId: orderId.toString(),
    });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL", details: error.message },
      { status: 500 }
    );
  }
} 