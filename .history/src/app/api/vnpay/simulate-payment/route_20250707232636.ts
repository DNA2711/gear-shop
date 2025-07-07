import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(request: Request) {
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

    const order = await db.queryFirst(
      "SELECT id, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Xác định order status dựa trên input
    let orderStatus;
    
    if (status === "paid") {
      orderStatus = "paid";  // Order đã thanh toán
    } else if (status === "failed") {
      orderStatus = "cancelled";   // Order bị hủy
    } else {
      orderStatus = status;
    }

    // Cập nhật order status
    await db.update(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [orderStatus, orderId]
    );

    return NextResponse.json({
      success: true,
      orderId,
      status: orderStatus,
      message: `Order ${orderId} updated: status=${orderStatus}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to simulate payment" },
      { status: 500 }
    );
  }
}
