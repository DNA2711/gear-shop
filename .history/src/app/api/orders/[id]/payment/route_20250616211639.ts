import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user
    const payload = await jwtService.verifyToken(token);
    const user = await db.queryFirst(
      "SELECT user_id FROM users WHERE email = ?",
      [payload.username]
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if order exists and belongs to user
    const order = await db.queryFirst(
      "SELECT id, user_id, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id !== user.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Order is not in pending status" },
        { status: 400 }
      );
    }

    // Simulate payment processing (in real app, integrate with payment gateway)
    // For demo purposes, we'll just update the status to 'paid'
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2s payment processing

    // Update order status to paid
    await db.update(
      "UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = ?",
      [orderId]
    );

    return NextResponse.json({
      message: "Payment processed successfully",
      orderId,
      status: "paid",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
