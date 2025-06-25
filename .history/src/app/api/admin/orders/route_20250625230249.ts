import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    // Get URL search params for pagination and filtering
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const offset = (page - 1) * limit;

    // Build WHERE clause using raw values instead of parameters
    let whereClause = "";

    if (status) {
      whereClause += ` WHERE o.status = '${status}'`;
    }

    if (search) {
      const searchPattern = search.replace(/'/g, "''"); // Escape single quotes
      if (whereClause) {
        whereClause += ` AND (u.full_name LIKE '%${searchPattern}%' OR u.email LIKE '%${searchPattern}%' OR o.id LIKE '%${searchPattern}%')`;
      } else {
        whereClause += ` WHERE (u.full_name LIKE '%${searchPattern}%' OR u.email LIKE '%${searchPattern}%' OR o.id LIKE '%${searchPattern}%')`;
      }
    }

    // First, get orders without items - using raw query
    let ordersQuery = `
      SELECT 
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.phone_number,
        o.created_at,
        o.updated_at,
        u.full_name as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id`;

    // Add WHERE clause if exists
    if (whereClause) {
      ordersQuery += whereClause;
    }

    ordersQuery += `
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`;

    console.log("SQL Query:", ordersQuery);

    const orders = await db.queryRaw(ordersQuery);

    // Then get items for each order
    for (const order of orders) {
      const items = await db.query(
        `SELECT 
          oi.id,
          oi.product_id,
          p.product_name,
          oi.quantity,
          oi.price
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      ${whereClause}
    `;

    const countResult = await db.queryRaw(countQuery);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : error);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token and check if user is admin
    const payload = await jwtService.verifyToken(token);
    const user = await db.queryFirst(
      "SELECT user_id, role FROM users WHERE email = ?",
      [payload.username]
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role?.toLowerCase() !== "admin") {
      console.log("User role check failed (PATCH):", {
        userRole: user.role,
        userEmail: payload.username,
      });
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { orderId, status } = await req.json();

    // Validate status (removed pending since orders are created as paid)
    const validStatuses = [
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
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
