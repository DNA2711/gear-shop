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
    const userId = payload.sub; // User ID from JWT payload

    const body: CreateOrderRequest = await req.json();
    const { shipping_address, phone_number, items } = body;

    // Start transaction
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (user_id, total_amount, shipping_address, phone_number)
         VALUES (?, ?, ?, ?)`,
        [userId, 0, shipping_address, phone_number]
      );
      const orderId = (orderResult as any).insertId;

      // Calculate total amount and insert order items
      let totalAmount = 0;
      for (const item of items) {
        const [productRows] = await connection.execute(
          "SELECT price FROM products WHERE product_id = ?",
          [item.product_id]
        );
        const products = productRows as any[];
        if (products.length === 0) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }
        const price = products[0].price;
        totalAmount += price * item.quantity;

        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, price]
        );
      }

      // Update order total amount
      await connection.execute(
        "UPDATE orders SET total_amount = ? WHERE id = ?",
        [totalAmount, orderId]
      );

      await connection.commit();

      return NextResponse.json({
        message: "Order created successfully",
        orderId,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
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

    const [rows] = await db.execute(
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
