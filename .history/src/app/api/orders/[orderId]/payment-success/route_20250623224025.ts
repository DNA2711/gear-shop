import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const resolvedParams = await params;
  try {
    // Await params for Next.js 15 compatibility
    const { orderId } = await params;
    console.log(
      "POST /api/orders/[orderId]/payment-success - OrderID:",
      orderId
    );

    // Check if order exists
    const order = await db.queryFirst(
      "SELECT id, status FROM orders WHERE id = ?",
      [orderId]
    );

    console.log("Order lookup result:", !!order);

    if (!order) {
      console.log("Order not found");
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order is already paid
    if (order.status === "paid") {
      console.log("Order already paid");
      return NextResponse.json({
        message: "Order already paid",
        orderId,
        status: order.status,
      });
    }

    // Update order status to 'paid'
    console.log("Updating order status to paid...");
    await db.update(
      "UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = ?",
      [orderId]
    );

    console.log("Order status updated successfully");
    return NextResponse.json({
      message: "Order payment confirmed successfully",
      orderId,
      status: "paid",
    });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    return NextResponse.json(
      { error: "Failed to update order payment status" },
      { status: 500 }
    );
  }
}
