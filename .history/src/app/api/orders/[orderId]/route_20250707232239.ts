import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { tokenUtils } from "@/lib/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check authentication (allow bypass in development)
    const isDevelopment = process.env.NODE_ENV === "development";
    let userId = null;

    if (!isDevelopment) {
      try {
        const userInfo = await tokenUtils.extractUserFromRequest(request);
      } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // Get order information (use total_amount, not total)
    const order = await db.queryFirst(
      `SELECT 
        o.id,
        o.user_id,
        o.total_amount as total,
        o.status,
        o.shipping_address,
        o.phone_number as phone,
        u.full_name,
        u.email,
        o.created_at,
        o.updated_at
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE o.id = ?`,
      [orderId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get order items
    const orderItems = await db.query(
      `SELECT 
        oi.product_id,
        oi.quantity,
        oi.price,
        p.product_name,
        p.product_code,
        pi.image_code as primary_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.product_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
      WHERE oi.order_id = ?`,
      [orderId]
    );

    const result = {
      ...order,
      items: orderItems || [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
