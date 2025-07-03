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
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    console.log("Simulating payment callback for order:", orderId, "status:", status);

    // Kiểm tra order có tồn tại không
    const order = await db.queryFirst(
      "SELECT id, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Cập nhật order status
    await db.update(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, orderId]
    );

    console.log("Order status updated:", orderId, "->", status);

    return NextResponse.json({
      success: true,
      orderId,
      status,
      message: `Order ${orderId} status updated to ${status}`
    });
  } catch (error) {
    console.error("Error simulating payment:", error);
    return NextResponse.json(
      { error: "Failed to simulate payment" },
      { status: 500 }
    );
  }
} 