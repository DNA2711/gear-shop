import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orderId = params.id;
    console.log("Checking status for order:", orderId);

    // Get order status from database
    const [rows] = await db.query(
      "SELECT status FROM orders WHERE order_id = ?",
      [orderId]
    );

    const order = Array.isArray(rows) ? rows[0] : rows;

    if (!order) {
      console.log("Order not found:", orderId);
      return new NextResponse("Order not found", { status: 404 });
    }

    console.log("Order status:", order.status);
    return NextResponse.json({ status: order.status });
  } catch (error) {
    console.error("Error checking order status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
