import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { verifyJWT } from "@/lib/jwt";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    console.log("GET /api/orders/[orderId] - OrderID:", orderId);

    // Get auth token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    let userId = null;
    if (token) {
      try {
        const decoded = await verifyJWT(token);
        userId = decoded.userId;
        console.log("Authenticated user:", userId);
      } catch (error) {
        console.log(
          "Invalid token or no auth, checking if order is accessible"
        );
      }
    }

    // Get order details with items - Fixed column names
    const orderQuery = `
      SELECT 
        o.*,
        oi.id as item_id,
        oi.product_id,
        oi.quantity,
        oi.price as item_price,
        p.product_name,
        pi.image_code as product_image
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
      WHERE o.id = ?
    `;

    const orderRows = await db.query(orderQuery, [orderId]);

    if (!orderRows || orderRows.length === 0) {
      console.log("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If user is authenticated, check if they own the order
    if (userId && orderRows[0].user_id !== userId) {
      console.log("Access denied: User doesn't own order", {
        userId,
        orderUserId: orderRows[0].user_id,
      });
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Build order object
    const order: any = {
      id: orderRows[0].id,
      user_id: orderRows[0].user_id,
      total: orderRows[0].total,
      status: orderRows[0].status,
      payment_method: orderRows[0].payment_method,
      shipping_address: orderRows[0].shipping_address,
      phone: orderRows[0].phone,
      email: orderRows[0].email,
      created_at: orderRows[0].created_at,
      updated_at: orderRows[0].updated_at,
      items: [],
    };

    // Add order items
    for (const row of orderRows) {
      if (row.item_id) {
        order.items.push({
          id: row.item_id,
          product_id: row.product_id,
          product_name: row.product_name,
          product_image: row.product_image,
          quantity: row.quantity,
          price: row.item_price,
        });
      }
    }

    console.log("Order retrieved successfully:", orderId);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error getting order by ID:", error);
    return NextResponse.json({ error: "Failed to get order" }, { status: 500 });
  }
}
