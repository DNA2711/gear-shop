import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";

// Cấu hình VNPay
const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || "DEMO";
const VNPAY_HASH_SECRET = process.env.VNPAY_SECRET_KEY || "DEMO_SECRET";
const VNPAY_URL =
  process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNPAY_RETURN_URL =
  process.env.VNPAY_RETURN_URL || "http://localhost:3000/checkout/success";

interface VNPayParams {
  vnp_Version: string;
  vnp_Command: string;
  vnp_TmnCode: string;
  vnp_Locale: string;
  vnp_CurrCode: string;
  vnp_TxnRef: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_Amount: number;
  vnp_ReturnUrl: string;
  vnp_IpAddr: string;
  vnp_CreateDate: string;
  vnp_SecureHash?: string;
  [key: string]: string | number | undefined;
}

function sortObject(obj: any) {
  const sorted: any = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Received payment request data:", data);

    const { orderId, amount, orderInfo } = data;

    // Validate input
    if (!orderId || !amount || !orderInfo) {
      console.error("Missing required parameters:", {
        orderId,
        amount,
        orderInfo,
      });
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
        numAmount,
      });
      return NextResponse.json(
        {
          error:
            "Số tiền giao dịch không hợp lệ. Số tiền hợp lệ từ 5,000 đến dưới 1 tỷ đồng",
        },
        { status: 400 }
      );
    }

    // Format createDate as YYYYMMDDHHmmss
    const now = new Date();
    const createDate =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    // Format mã đơn hàng: GS + TIMESTAMP
    const formattedOrderId = `GS${createDate}`;

    console.log("Payment details:", {
      originalAmount: amount,
      numAmount: numAmount,
      amountToVNPay: numAmount * 100,
      formattedAmount: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numAmount),
      formattedOrderId,
    });

    // Tạo các tham số thanh toán
    const tmnCode = VNPAY_TMN_CODE;
    const secretKey = VNPAY_HASH_SECRET;
    const returnUrl = VNPAY_RETURN_URL;

    const vnpParams: VNPayParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: formattedOrderId,
      vnp_OrderInfo: encodeURIComponent(orderInfo),
      vnp_OrderType: "other",
      vnp_Amount: numAmount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    // Sắp xếp các tham số theo thứ tự a-z
    const sortedParams = sortObject(vnpParams);

    // Tạo chuỗi ký tự cần ký
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    // Tạo chữ ký
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Thêm chữ ký vào params
    vnpParams.vnp_SecureHash = signed;

    // Tạo URL thanh toán với encode
    const paymentUrl = `${VNPAY_URL}?${Object.keys(vnpParams)
      .map((key) => `${key}=${encodeURIComponent(vnpParams[key] as string)}`)
      .join("&")}`;

    console.log("Generated payment URL:", paymentUrl);

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId: formattedOrderId,
    });
  } catch (error: any) {
    console.error("Error creating payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL", details: error.message },
      { status: 500 }
    );
  }
}
