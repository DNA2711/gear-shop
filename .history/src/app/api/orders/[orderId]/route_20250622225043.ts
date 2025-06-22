import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const orderId = params.orderId;

    // Get order details
    const [order] = await db.execute(
      `SELECT o.*, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [orderId]
    );

    if (!order || order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user owns this order or is admin
    if (decoded.role !== "admin" && order[0].user_id !== decoded.userId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get order items
    const [orderItems] = await db.execute(
      `SELECT oi.*, p.name as product_name, p.price as product_price, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const orderData = {
      ...order[0],
      items: orderItems,
    };

    return NextResponse.json(orderData);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
