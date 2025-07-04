import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/database";

// Cấu hình VNPay
const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || "DEMO";
const VNPAY_HASH_SECRET = process.env.VNPAY_SECRET_KEY || "DEMO_SECRET";
const VNPAY_URL = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

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
    const orderId = queryParams.vnp_TxnRef;
    const responseCode = queryParams.vnp_ResponseCode;
    const transactionStatus = queryParams.vnp_TransactionStatus;
    const secureHash = queryParams.vnp_SecureHash;

    // Tạo chữ ký để verify
    const verifyParams = { ...queryParams };
    delete verifyParams.vnp_SecureHash;
    delete verifyParams.vnp_SecureHashType;

    // Sắp xếp các tham số theo thứ tự a-z
    const sortedParams = Object.keys(verifyParams)
      .sort()
      .reduce((acc: Record<string, string>, key) => {
        acc[key] = verifyParams[key];
        return acc;
      }, {});

    // Tạo chuỗi ký tự cần verify
    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    // Tạo chữ ký
    const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Verify chữ ký
    const isValidSignature = secureHash === signed;

    console.log("VNPay verification result:", {
      orderId,
      responseCode,
      transactionStatus,
      isValidSignature,
      isSuccess: responseCode === "00" && transactionStatus === "00" && isValidSignature,
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

    // Cập nhật trạng thái đơn hàng
    if (responseCode === "00" && transactionStatus === "00" && isValidSignature) {
      await db.update(
        "UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?",
        ["processing", "paid", orderId]
      );
      return NextResponse.redirect(
        new URL(`/checkout/success?orderId=${orderId}`, request.url)
      );
    } else {
      await db.update(
        "UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?",
        ["cancelled", "failed", orderId]
      );
      return NextResponse.redirect(
        new URL(`/checkout?error=payment_failed&orderId=${orderId}`, request.url)
      );
    }
  } catch (error) {
    console.error("Error processing VNPay callback:", error);
    return NextResponse.redirect(
      new URL("/checkout?error=internal_error", request.url)
    );
  }
}
