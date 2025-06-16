import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
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

    const { orderId } = await params;

    // Get order details
    const order = await db.queryFirst(
      `SELECT id, user_id, total_amount, status, shipping_address, 
              phone_number, created_at, updated_at
       FROM orders 
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get order items with product details
    const items = await db.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price,
              p.product_name, p.product_code,
              b.brand_name,
              pi.image_code as primary_image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.product_id
       LEFT JOIN brands b ON p.brand_id = b.brand_id
       LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const orderWithItems = {
      ...order,
      items: items,
    };

    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
