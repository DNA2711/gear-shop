import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Handle both GET and POST requests
export async function GET(request: Request) {
  return handleCallback(request);
}

export async function POST(request: Request) {
  return handleCallback(request);
}

async function handleCallback(request: Request) {
  try {
    // Get order ID from query parameters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    console.log("Processing payment callback for order:", orderId);

    // Update order status to paid
    await db.query(
      "UPDATE orders SET status = 'paid' WHERE order_id = ?",
      [orderId]
    );

    console.log("Order status updated to paid");

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: "Payment processed successfully",
      orderId: orderId
    });
  } catch (error) {
    console.error("Error processing payment callback:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
