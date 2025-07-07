import { NextResponse } from "next/server";
import { db } from "@/lib/database";
import { jwtService } from "@/lib/jwt";

async function authenticateRequest(request: Request) {
  // Bypass auth in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("🔓 Development mode: Bypassing authentication");
    return { userId: null, isAdmin: true }; // Allow all access in dev
  }

  // Get token from Authorization header
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    throw new Error("Unauthorized");
  }

  // Verify token and get user
  const payload = await jwtService.verifyToken(token);
  const user = await db.queryFirst(
    "SELECT user_id, role FROM users WHERE email = ?",
    [payload.username]
  );
  
  if (!user) {
    throw new Error("User not found");
  }

  return { 
    userId: user.user_id, 
    isAdmin: user.role === 'admin' 
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    console.log("Getting order details for ID:", orderId);

    // Authenticate request
    let auth;
    try {
      auth = await authenticateRequest(request);
    } catch (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      );
    }

    // Lấy thông tin order
    const order = await db.queryFirst(
      `SELECT 
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        payment_method,
        shipping_address,
        phone,
        email,
        created_at,
        updated_at
      FROM orders 
      WHERE id = ?`,
      [orderId]
    );

    if (!order) {
      console.log("Order not found:", orderId);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user can access this order (own order or admin)
    if (!auth.isAdmin && auth.userId && order.user_id !== auth.userId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Lấy chi tiết items của order
    const orderItems = await db.query(
      `SELECT 
        oi.*,
        p.name as product_name,
        p.brand,
        p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`,
      [orderId]
    );

    console.log("Order found:", {
      id: order.id,
      status: order.status,
      payment_status: order.payment_status,
      itemCount: orderItems.length,
      authMode: process.env.NODE_ENV === "development" ? "development" : "production"
    });

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items: orderItems
      }
    });

  } catch (error) {
    console.error("Error getting order:", error);
    return NextResponse.json(
      { error: "Failed to get order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const { status, payment_status } = await request.json();

    console.log("Updating order:", {
      orderId,
      status,
      payment_status
    });

    // Authenticate request (admin only for updates)
    let auth;
    try {
      auth = await authenticateRequest(request);
      if (!auth.isAdmin && process.env.NODE_ENV !== "development") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    } catch (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      );
    }

    // Kiểm tra order có tồn tại không
    const existingOrder = await db.queryFirst(
      "SELECT id FROM orders WHERE id = ?",
      [orderId]
    );

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Cập nhật order
    const updateFields = [];
    const updateValues = [];

    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    if (payment_status) {
      updateFields.push("payment_status = ?");
      updateValues.push(payment_status);
    }

    updateFields.push("updated_at = NOW()");
    updateValues.push(orderId);

    if (updateFields.length > 1) { // Có ít nhất 1 field để update (ngoài updated_at)
      await db.update(
        `UPDATE orders SET ${updateFields.join(", ")} WHERE id = ?`,
        updateValues
      );
    }

    // Lấy order đã update
    const updatedOrder = await db.queryFirst(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    console.log("Order updated successfully:", {
      id: updatedOrder.id,
      status: updatedOrder.status,
      payment_status: updatedOrder.payment_status
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
} 