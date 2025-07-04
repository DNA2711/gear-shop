import { NextResponse, NextRequest } from "next/server";
import { VNPay } from "vnpay";

// Cấu hình VNPay
const vnpay = new VNPay({
  tmnCode: "DEMO",
  secureSecret: "DEMO_SECRET",
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true,
});

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

    const createDate = Math.floor(Date.now() / 1000);

    console.log("Payment details:", {
      originalAmount: amount,
      numAmount: numAmount,
      formattedAmount: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numAmount),
    });

    // Build payment URL trực tiếp không qua buildPaymentUrl
    const params = new URLSearchParams();
    params.append("vnp_Version", "2.1.0");
    params.append("vnp_Command", "pay");
    params.append("vnp_TmnCode", "DEMO");
    params.append("vnp_Locale", "vn");
    params.append("vnp_CurrCode", "VND");
    params.append("vnp_TxnRef", orderId.toString());
    params.append("vnp_OrderInfo", orderInfo);
    params.append("vnp_OrderType", "other");
    params.append("vnp_Amount", (numAmount * 100).toString());
    params.append("vnp_ReturnUrl", "http://localhost:3000/checkout/success");
    params.append(
      "vnp_IpAddr",
      request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1"
    );
    params.append("vnp_CreateDate", createDate.toString());
    params.append("vnp_BankCode", "NCB");

    // Tạo URL thanh toán
    const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${params.toString()}`;
    console.log("Generated payment URL:", paymentUrl);

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId: orderId.toString(),
    });
  } catch (error: any) {
    console.error("Error creating payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL", details: error.message },
      { status: 500 }
    );
  }
}
