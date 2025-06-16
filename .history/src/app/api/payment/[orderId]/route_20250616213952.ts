import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Get order details (public access for payment)
    const order = await db.queryFirst(
      `SELECT id, total_amount, status, shipping_address, 
              phone_number, created_at, updated_at
       FROM orders 
       WHERE id = ?`,
      [orderId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get order items with product details
    const items = await db.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price,
              p.product_name, p.product_code
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    const orderWithItems = {
      ...order,
      items: items,
    };

    return NextResponse.json(orderWithItems);
  } catch (error) {
    console.error("Error fetching order for payment:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
} 