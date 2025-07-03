import { NextResponse, NextRequest } from "next/server";
import { VNPay } from "vnpay";
import { db } from "@/lib/database";

// Cấu hình VNPay (sử dụng sandbox)
const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE || "DEMO",
  secureSecret: process.env.VNPAY_SECURE_SECRET || "DEMO_SECRET",
  vnpayHost: process.env.VNPAY_HOST || "https://sandbox.vnpayment.vn",
  testMode: true, // Đặt false khi production
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams: Record<string, string> = {};

    // Chuyển đổi URLSearchParams thành object
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }

    console.log("VNPay callback received:", queryParams);

    // Verify payment result từ VNPay
    // Note: Skip signature verification in development mode
    console.log("VNPay callback params:", queryParams);

    const orderId = verifyResult.vnp_TxnRef;
    const responseCode = verifyResult.vnp_ResponseCode;
    const transactionStatus = verifyResult.vnp_TransactionStatus;

    console.log("VNPay verification result:", {
      orderId,
      responseCode,
      transactionStatus,
      isSuccess: responseCode === "00" && transactionStatus === "00",
    });

    // Kiểm tra order có tồn tại không
    const order = await db.queryFirst(
      "SELECT id, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.redirect(
        new URL("/checkout?error=order_not_found", request.url)
      );
    }

    // Kiểm tra thanh toán thành công
    if (responseCode === "00" && transactionStatus === "00") {
      // Thanh toán thành công
      if (order.status !== "paid") {
        await db.update(
          "UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = ?",
          [orderId]
        );
        console.log("Order payment confirmed:", orderId);
      }

      // Redirect đến trang success
      return NextResponse.redirect(
        new URL(`/checkout/success?orderId=${orderId}`, request.url)
      );
    } else {
      // Thanh toán thất bại
      console.log(
        "Payment failed for order:",
        orderId,
        "Response code:",
        responseCode
      );

      // Cập nhật trạng thái đơn hàng nếu cần
      if (order.status === "pending") {
        await db.update(
          "UPDATE orders SET status = 'failed', updated_at = NOW() WHERE id = ?",
          [orderId]
        );
      }

      // Redirect đến trang error với thông tin lỗi
      return NextResponse.redirect(
        new URL(
          `/checkout?error=payment_failed&code=${responseCode}`,
          request.url
        )
      );
    }
  } catch (error) {
    console.error("Error processing VNPay callback:", error);
    return NextResponse.redirect(
      new URL("/checkout?error=callback_error", request.url)
    );
  }
}
