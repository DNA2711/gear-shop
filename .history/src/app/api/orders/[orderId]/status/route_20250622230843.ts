import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Await params for Next.js 15 compatibility
    const { orderId } = await params;

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
    const userId = user.user_id;

    // Check if order exists and belongs to user
    const order = await db.queryFirst(
      "SELECT id, status FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      orderId,
      status: order.status,
    });
  } catch (error) {
    console.error("Error fetching order status:", error);
    return NextResponse.json(
      { error: "Failed to fetch order status" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
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
    const userId = user.user_id;

    const { orderId } = params;
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (
      !["pending", "paid", "cancelled", "shipped", "delivered"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if order exists and belongs to user
    const order = await db.queryFirst(
      "SELECT id FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status
    await db.update(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, orderId]
    );

    return NextResponse.json({
      message: "Order status updated successfully",
      orderId,
      status,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
