import { NextResponse } from "next/server";
import { VNPay } from "vnpay";

// Cấu hình VNPay (sử dụng sandbox)
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE || "DEMO",
  secureSecret: process.env.VNPAY_SECURE_SECRET || "DEMO_SECRET",
  vnpayHost: process.env.VNPAY_HOST || "https://sandbox.vnpayment.vn",
  testMode: true, // Đặt false khi production
});

// Hàm phát hiện môi trường
function getReturnUrl(orderId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const isProduction =
    process.env.NODE_ENV === "production" ||
    baseUrl.includes("vercel.app") ||
    baseUrl.includes("netlify.app") ||
    baseUrl.includes("railway.app") ||
    baseUrl.includes("herokuapp.com") ||
    !baseUrl.includes("localhost");

  if (isProduction) {
    // Production: sử dụng callback API để VNPay gọi về
    return `${baseUrl}/api/vnpay/callback`;
  } else {
    // Development: sử dụng localhost thay thế
    return `${baseUrl}/checkout/success?orderId=${orderId}&from=vnpay`;
  }
}

export async function POST(request: Request) {
  try {
    const { orderId, amount, orderInfo } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount according to VNPay requirements
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 5000) {
      return NextResponse.json(
        { error: "Số tiền phải từ 5,000 VND trở lên" },
        { status: 400 }
      );
    }

    if (numAmount >= 1000000000) {
      // 1 billion VND
      return NextResponse.json(
        { error: "Số tiền phải dưới 1 tỷ đồng" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const isProduction =
      process.env.NODE_ENV === "production" ||
      baseUrl.includes("vercel.app") ||
      baseUrl.includes("netlify.app") ||
      baseUrl.includes("railway.app") ||
      baseUrl.includes("herokuapp.com") ||
      !baseUrl.includes("localhost");

    // DEVELOPMENT MODE: Simulate VNPay flow
    if (!isProduction) {
      console.log("🔧 DEVELOPMENT MODE: Simulating VNPay payment flow");

      // Tạo một mock payment URL giống VNPay
      const simulatedPaymentUrl = `${baseUrl}/vnpay/checkout?orderId=${orderId}&amount=${numAmount}&orderInfo=${encodeURIComponent(
        orderInfo || `Thanh toan don hang ${orderId}`
      )}`;

      console.log("Development VNPay simulation:", {
        orderId,
        amount: numAmount,
        simulatedPaymentUrl,
        message: "This is a simulated VNPay URL for development",
      });

      return NextResponse.json({
        success: true,
        paymentUrl: simulatedPaymentUrl,
        orderId,
        environment: "development-simulation",
        message: "Development mode: Using simulated VNPay flow",
      });
    }

    // PRODUCTION MODE: Real VNPay
    const vnpAmount = Math.round(numAmount);
    const returnUrl = getReturnUrl(orderId);

    console.log("🚀 PRODUCTION MODE: Real VNPay payment");
    console.log("VNPay payment params:", {
      orderId,
      originalAmount: amount,
      numAmount,
      vnpAmount,
      returnUrl,
      environment: process.env.NODE_ENV,
      orderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
    });

    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: vnpAmount,
      vnp_Command: "pay",
      vnp_CreateDate: Number(
        new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[-:]/g, "")
          .replace("T", "")
      ),
      vnp_CurrCode: "VND" as any,
      vnp_IpAddr: "127.0.0.1",
      vnp_Locale: "vn" as any,
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: orderId,
    });

    console.log("VNPay payment URL created for order:", orderId);

    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl.toString(),
      orderId,
      returnUrl,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Error creating VNPay payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL" },
      { status: 500 }
    );
  }
}
