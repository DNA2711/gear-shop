import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Get order ID from query parameters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Update order status to paid
    await db.query("UPDATE orders SET status = 'paid' WHERE order_id = ?", [
      orderId,
    ]);

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/payment/success?orderId=${orderId}`, request.url)
    );
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
