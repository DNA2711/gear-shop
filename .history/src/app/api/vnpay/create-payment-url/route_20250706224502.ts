import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

// Cấu hình VNPay
const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || "DEMO";
const VNPAY_HASH_SECRET = process.env.VNPAY_SECRET_KEY || "DEMO_SECRET";

// Trong development, sử dụng mock VNPay; Production sử dụng VNPay thật
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

    console.log("VNPay payment request:", {
      orderId,
      amount,
      orderInfo,
      environment: process.env.NODE_ENV,
      isDevelopment: IS_DEVELOPMENT,
    });

    // Trong development mode, redirect đến mock VNPay
    if (IS_DEVELOPMENT) {
      const mockPaymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/vnpay/checkout?orderId=${orderId}&amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}`;
      
      console.log("Using mock VNPay for development:", mockPaymentUrl);
      
      return NextResponse.json({
        success: true,
        paymentUrl: mockPaymentUrl,
        orderId,
        isDevelopment: true,
      });
    }

    // Production mode - sử dụng VNPay thật
    if (!VNPAY_TMN_CODE || !VNPAY_HASH_SECRET) {
      console.error("Missing VNPAY configuration for production:", {
        VNPAY_TMN_CODE: !!VNPAY_TMN_CODE,
        VNPAY_HASH_SECRET: !!VNPAY_HASH_SECRET,
      });
      return NextResponse.json(
        { error: "Invalid VNPAY configuration" },
        { status: 500 }
      );
    }

    // Format createDate as YYYYMMDDHHmmss
    const now = new Date();
    const createDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes()
    ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

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

    const VNPAY_URL = "https://vnpayment.vn/paymentv2/vpcpay.html";
    const VNPAY_RETURN_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vnpay/callback`;

    // Tạo các tham số thanh toán
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

    // Sắp xếp các tham số theo thứ tự a-z
    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((acc: Record<string, string | number>, key) => {
        acc[key] = vnpParams[key as keyof typeof vnpParams];
        return acc;
      }, {});

    // Tạo chuỗi ký tự cần mã hóa
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    // Tạo chữ ký
    const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Thêm chữ ký vào params
    const vnpParamsWithHash = {
      ...vnpParams,
      vnp_SecureHash: signed,
    };

    // Tạo URL thanh toán
    const paymentUrl = `${VNPAY_URL}?${Object.keys(vnpParamsWithHash)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(vnpParamsWithHash[key as keyof typeof vnpParamsWithHash])}`
      )
      .join("&")}`;

    console.log("Generated payment URL for production:", {
      url: paymentUrl,
      environment: process.env.NODE_ENV,
    });

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
      isDevelopment: false,
    });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL" },
      { status: 500 }
    );
  }
}
