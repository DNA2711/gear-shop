import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/database";
import { NotificationService } from "@/lib/notificationUtils";

const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || "DEMO";
const VNPAY_HASH_SECRET = process.env.VNPAY_SECRET_KEY || "DEMO_SECRET";
const VNPAY_URL =
  process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }

    console.log("VNPay callback received:", queryParams);

    const orderId = queryParams.vnp_TxnRef;
    const responseCode = queryParams.vnp_ResponseCode;
    const transactionStatus = queryParams.vnp_TransactionStatus;
    const secureHash = queryParams.vnp_SecureHash;

    const verifyParams = { ...queryParams };
    delete verifyParams.vnp_SecureHash;
    delete verifyParams.vnp_SecureHashType;

    const sortedParams = Object.keys(verifyParams)
      .sort()
      .reduce((acc: Record<string, string>, key) => {
        acc[key] = verifyParams[key];
        return acc;
      }, {});

    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const isValidSignature = secureHash === signed;

    console.log("VNPay verification result:", {
      orderId,
      responseCode,
      transactionStatus,
      isValidSignature,
      isSuccess:
        responseCode === "00" && transactionStatus === "00" && isValidSignature,
    });

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

    if (
      responseCode === "00" &&
      transactionStatus === "00" &&
      isValidSignature
    ) {
      await db.update(
        "UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?",
        ["processing", "paid", orderId]
      );

      try {
        const orderDetails = await db.queryFirst(
          "SELECT o.user_id, o.total_amount, u.full_name, COUNT(oi.id) as items_count FROM orders o LEFT JOIN users u ON o.user_id = u.user_id LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.id = ? GROUP BY o.id",
          [orderId]
        );

        if (orderDetails) {
          await NotificationService.createOrderSuccessNotification(orderDetails.user_id, {
            orderId: parseInt(orderId),
            totalAmount: orderDetails.total_amount,
            itemsCount: orderDetails.items_count,
          });

          await NotificationService.createNewOrderNotificationForAdmin({
            orderId: parseInt(orderId),
            customerName: orderDetails.full_name,
            customerId: orderDetails.user_id,
            totalAmount: orderDetails.total_amount,
            itemsCount: orderDetails.items_count,
          });

          console.log(`Payment successful! Notifications created for order ${orderId}`);
        }
      } catch (notificationError) {
        console.error("Error creating notifications after payment:", notificationError);
      }

      return NextResponse.redirect(
        new URL(`/checkout/success?orderId=${orderId}`, request.url)
      );
    } else {
      await db.update(
        "UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?",
        ["cancelled", "failed", orderId]
      );
      return NextResponse.redirect(
        new URL(
          `/checkout?error=payment_failed&orderId=${orderId}`,
          request.url
        )
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error processing VNPay callback:", error);
    } else {
      console.error("Error processing VNPay callback:", (error as any).message);
    }
    return NextResponse.redirect(
      new URL("/checkout?error=internal_error", request.url)
    );
  }
}
