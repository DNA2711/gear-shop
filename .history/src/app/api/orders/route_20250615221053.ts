import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";
import { CreateOrderRequest } from "@/types/order";

export async function POST(req: Request) {
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
    const user = await db.queryFirst("SELECT user_id FROM users WHERE email = ?", [payload.username]);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user.user_id;

    const body: CreateOrderRequest = await req.json();
    const { shipping_address, phone_number, items } = body;

    // Start transaction using the database helper
    const connection = await db.beginTransaction();
    try {
      // Create order
      const orderId = await db.insert(
        `INSERT INTO orders (user_id, total_amount, shipping_address, phone_number)
         VALUES (?, ?, ?, ?)`,
        [userId, 0, shipping_address, phone_number]
      );

      // Calculate total amount and insert order items
      let totalAmount = 0;
      for (const item of items) {
        const product = await db.queryFirst(
          "SELECT price FROM products WHERE product_id = ?",
          [item.product_id]
        );
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
        const price = product.price;
        totalAmount += price * item.quantity;

        await db.insert(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, price]
        );
      }

      // Update order total amount
      await db.update("UPDATE orders SET total_amount = ? WHERE id = ?", [
        totalAmount,
        orderId,
      ]);

      await db.commitTransaction(connection);

      return NextResponse.json({
        message: "Order created successfully",
        orderId,
      });
    } catch (error) {
      await db.rollbackTransaction(connection);
      throw error;
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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
    const userId = payload.sub; // User ID from JWT payload

    const rows = await db.query(
      `SELECT o.id, o.user_id, o.total_amount, o.status, o.shipping_address, 
              o.phone_number, o.created_at, o.updated_at,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'quantity', oi.quantity,
                  'price', oi.price
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
