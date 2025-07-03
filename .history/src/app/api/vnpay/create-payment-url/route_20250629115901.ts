import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, orderInfo } = body;

    console.log("🔧 DEVELOPMENT MODE: Simulating VNPay payment flow");

    // Validate amount
    const amountNum = parseInt(amount);
    if (amountNum < 5000) {
      return NextResponse.json(
        {
          error:
            "Số tiền giao dịch không hợp lệ. Số tiền hợp lệ từ 5,000 đến dưới 1 tỷ đồng",
        },
        { status: 400 }
      );
    }

    if (amountNum >= 1000000000) {
      return NextResponse.json(
        {
          error:
            "Số tiền giao dịch không hợp lệ. Số tiền hợp lệ từ 5,000 đến dưới 1 tỷ đồng",
        },
        { status: 400 }
      );
    }

    // Development mode: Return simulated VNPay URL
    const simulatedPaymentUrl = `http://localhost:3000/vnpay/checkout?orderId=${orderId}&amount=${amount}&orderInfo=${encodeURIComponent(
      orderInfo
    )}`;

    const response = {
      orderId,
      amount,
      simulatedPaymentUrl,
      message: "This is a simulated VNPay URL for development",
    };

    console.log("Development VNPay simulation:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating VNPay payment URL:", error);
    return NextResponse.json(
      { error: "Failed to create payment URL" },
      { status: 500 }
    );
  }
}
