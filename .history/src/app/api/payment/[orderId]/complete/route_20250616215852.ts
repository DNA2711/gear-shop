import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Check if order exists and is not already paid
    const order = await db.queryFirst(
      "SELECT id, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({
        message: "Order already paid",
        orderId,
        status: "paid",
      });
    }

    // Update order status to paid
    await db.update(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      ["paid", orderId]
    );

    console.log(`Order ${orderId} payment completed successfully`);

    return NextResponse.json({
      message: "Payment completed successfully",
      orderId,
      status: "paid",
    });
  } catch (error) {
    console.error("Error completing payment:", error);
    return NextResponse.json(
      { error: "Failed to complete payment" },
      { status: 500 }
    );
  }
}
