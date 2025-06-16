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
    const user = await db.queryFirst(
      "SELECT user_id FROM users WHERE email = ?",
      [payload.username]
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user.user_id;

    const body: CreateOrderRequest = await req.json();
    const { shipping_address, phone_number, items } = body;

    // Start transaction using the database helper
    const connection = await db.beginTransaction();
    try {
      // Create order with 'pending' status (chờ thanh toán)
      const orderId = await db.insert(
        `INSERT INTO orders (user_id, total_amount, status, shipping_address, phone_number)
         VALUES (?, ?, 'pending', ?, ?)`,
        [userId, 0, shipping_address, phone_number]
      );

      // Calculate total amount and insert order items
      let totalAmount = 0;
      for (const item of items) {
        console.log(
          `Processing item: product_id=${item.product_id}, quantity=${item.quantity}`
        );

        const product = await db.queryFirst(
          "SELECT price FROM products WHERE product_id = ?",
          [item.product_id]
        );

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        const price = parseFloat(product.price);
        console.log(`Product price: ${price}, type: ${typeof price}`);

        if (isNaN(price) || price < 0) {
          throw new Error(
            `Invalid price for product ${item.product_id}: ${price}`
          );
        }

        if (price > 9999999999999.99) {
          throw new Error(
            `Price too large for product ${item.product_id}: ${price}`
          );
        }

        totalAmount += price * item.quantity;

        console.log(
          `Inserting order_item: orderId=${orderId}, productId=${item.product_id}, quantity=${item.quantity}, price=${price}`
        );

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
    const user = await db.queryFirst(
      "SELECT user_id FROM users WHERE email = ?",
      [payload.username]
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user.user_id;

    // First, get all orders for the user
    const orders = await db.query(
      `SELECT id, user_id, total_amount, status, shipping_address, 
              phone_number, created_at, updated_at
       FROM orders 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    // Then, get order items with product details for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
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
          [order.id]
        );

        return {
          ...order,
          items: items,
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
