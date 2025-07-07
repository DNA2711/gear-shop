import { NextResponse } from "next/server";
import { db } from "@/lib/database";

// API này chỉ dành cho development để simulate VNPay callback
export async function POST(request: Request) {
  // Chỉ cho phép trong development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development" },
      { status: 403 }
    );
  }

  try {
    const { orderId, status = "paid" } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    console.log(
      "Simulating payment callback for order:",
      orderId,
      "status:",
      status
    );

    // Kiểm tra order có tồn tại không
    const order = await db.queryFirst(
      "SELECT id, status, payment_status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Found order:", {
      id: order.id,
      currentStatus: order.status,
      currentPaymentStatus: order.payment_status
    });

    // Xác định order status và payment status dựa trên input
    let orderStatus, paymentStatus;
    
    if (status === "paid") {
      orderStatus = "processing";  // Order chuyển sang processing
      paymentStatus = "paid";      // Payment đã thanh toán
    } else if (status === "failed") {
      orderStatus = "cancelled";   // Order bị hủy
      paymentStatus = "failed";    // Payment thất bại
    } else {
      orderStatus = status;
      paymentStatus = status;
    }

    // Cập nhật cả order status và payment status
    await db.update(
      "UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE id = ?",
      [orderStatus, paymentStatus, orderId]
    );

    console.log("Order updated successfully:", {
      orderId,
      oldStatus: order.status,
      newStatus: orderStatus,
      oldPaymentStatus: order.payment_status,
      newPaymentStatus: paymentStatus
    });

    return NextResponse.json({
      success: true,
      orderId,
      status: orderStatus,
      payment_status: paymentStatus,
      message: `Order ${orderId} updated: status=${orderStatus}, payment_status=${paymentStatus}`,
    });
  } catch (error) {
    console.error("Error simulating payment:", error);
    return NextResponse.json(
      { error: "Failed to simulate payment" },
      { status: 500 }
    );
  }
}
