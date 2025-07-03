import { NextResponse } from "next/server";
import { VNPay } from "vnpay";

// Cấu hình VNPay (sử dụng sandbox)
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE || "DEMO",
  secureSecret: process.env.VNPAY_SECURE_SECRET || "DEMO_SECRET",
  vnpayHost: process.env.VNPAY_HOST || "https://sandbox.vnpayment.vn",
  testMode: true, // Đặt false khi production
  hashAlgorithm: "SHA512",
});

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

    // Tạo payment URL
    const vnpAmount = Math.round(numAmount); // VNPay sử dụng đơn vị VND, không cần * 100

    console.log("VNPay payment params:", {
      orderId,
      originalAmount: amount,
      numAmount,
      vnpAmount,
      orderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
    });

    // Determine return URL - must be accessible from internet
    let returnUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // In development, check if we have a public URL
    if (!returnUrl || returnUrl.includes("localhost")) {
      // Try to get ngrok URL first
      try {
        const ngrokResponse = await fetch("http://localhost:4040/api/tunnels");
        if (ngrokResponse.ok) {
          const ngrokData = await ngrokResponse.json();
          const httpsTunnel = ngrokData.tunnels?.find(
            (t: any) => t.proto === "https"
          );
          if (httpsTunnel) {
            returnUrl = httpsTunnel.public_url;
            console.log("Using ngrok URL:", returnUrl);
          }
        }
      } catch (error) {
        console.log("Ngrok not available, using fallback");
      }

      // Fallback: use a development callback that shows instructions
      if (!returnUrl || returnUrl.includes("localhost")) {
        returnUrl = "https://webhook.site/unique-url"; // Temporary URL for testing
        console.warn(
          "⚠️ Using webhook.site for testing. In production, use your domain."
        );
      }
    }

    const finalReturnUrl = `${returnUrl}/api/vnpay/callback`;
    console.log("VNPay return URL:", finalReturnUrl);

    const paymentUrl = await vnpay.buildPaymentUrl({
      vnp_Amount: vnpAmount,
      vnp_Command: "pay",
      vnp_CreateDate: new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[-:]/g, "")
        .replace("T", ""),
      vnp_CurrCode: "VND",
      vnp_IpAddr: "127.0.0.1",
      vnp_Locale: "vn",
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: finalReturnUrl,
      vnp_TxnRef: orderId,
    });

    console.log("VNPay payment URL created for order:", orderId);

    return NextResponse.json({
      success: true,
      paymentUrl: paymentUrl.toString(),
      orderId,
    });
  } catch (error) {
    console.error("Error creating VNPay payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL" },
      { status: 500 }
    );
  }
}
