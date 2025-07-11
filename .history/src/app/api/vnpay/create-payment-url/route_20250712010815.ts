import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

// Cấu hình VNPay
const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || "DEMO";
const VNPAY_HASH_SECRET = process.env.VNPAY_SECRET_KEY || "DEMO_SECRET";

// Kiểm tra xem có đang dùng cấu hình demo không
const IS_DEMO_MODE =
  VNPAY_TMN_CODE === "DEMO" || VNPAY_HASH_SECRET === "DEMO_SECRET";
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, orderInfo } = await request.json();

    if (!orderId || !amount || !orderInfo) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Sử dụng Mock VNPay khi có cấu hình DEMO (bất kể môi trường nào)
    if (IS_DEMO_MODE) {
      // Xử lý baseUrl một cách thông minh
      let baseUrl;

      // Ưu tiên NEXT_PUBLIC_BASE_URL từ environment
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      }
      // Nếu không có, thử VERCEL_URL (tự động set bởi Vercel)
      else if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      }
      // Cuối cùng, fallback từ request headers
      else {
        const host = request.headers.get("host");
        const protocol =
          request.headers.get("x-forwarded-proto") ||
          (host?.includes("localhost") ? "http" : "https");

        if (host) {
          baseUrl = `${protocol}://${host}`;
        } else {
          baseUrl = IS_DEVELOPMENT
            ? "http://localhost:3000"
            : "https://gearhub-vn.vercel.app";
        }
      }

      baseUrl = baseUrl.replace(/\/$/, "");

      const mockPaymentUrl = `${baseUrl}/vnpay/checkout?orderId=${orderId}&amount=${amount}&orderInfo=${encodeURIComponent(
        orderInfo
      )}`;

      return NextResponse.json({
        success: true,
        paymentUrl: mockPaymentUrl,
        orderId,
        isDevelopment: IS_DEVELOPMENT,
        isDemoMode: true,
      });
    }

    const numAmount = Math.round(Number(amount));
    if (isNaN(numAmount)) {
      console.error("Invalid amount format:", amount);
      return NextResponse.json(
        { error: "Amount must be a number" },
        { status: 400 }
      );
    }

    if (numAmount < 1000 || numAmount >= 1000000000) {
      console.error("Invalid amount range:", {
        originalAmount: amount,
        numAmount,
      });
      return NextResponse.json(
        {
          error:
            "Số tiền giao dịch không hợp lệ. Số tiền hợp lệ từ 1,000 đến dưới 1 tỷ đồng",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const createDate = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    const VNPAY_URL = IS_DEVELOPMENT
      ? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" // Sandbox
      : "https://vnpayment.vn/paymentv2/vpcpay.html"; // Production

    const VNPAY_RETURN_URL = IS_DEVELOPMENT
      ? `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/checkout/success`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/vnpay/callback`;

    const vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: VNPAY_TMN_CODE,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: numAmount,
      vnp_ReturnUrl: VNPAY_RETURN_URL,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc: Record<string, string | number>, key) => {
        acc[key] = vnpParams[key as keyof typeof vnpParams];
        return acc;
      }, {});

    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const vnpParamsWithHash = {
      ...vnpParams,
      vnp_SecureHash: signed,
    };

    const paymentUrl = `${VNPAY_URL}?${Object.keys(vnpParamsWithHash)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(
            vnpParamsWithHash[key as keyof typeof vnpParamsWithHash]
          )}`
      )
      .join("&")}`;

    console.log("Payment URL:", paymentUrl);

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
      isDevelopment: IS_DEVELOPMENT,
      isDemoMode: IS_DEMO_MODE,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating payment URL:", error);
    } else {
      console.error("Error creating payment URL:", (error as any).message);
    }
    return NextResponse.json(
      { error: "Failed to create payment URL" },
      { status: 500 }
    );
  }
}
