import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    // Get order from database
    const order = await db.queryFirst(
      "SELECT id, status, total_amount FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // TODO: Integrate with real payment gateway (VNPay, Momo, etc.)
    // For now, we'll check if there's any external payment confirmation
    
    // Check if payment was confirmed externally (you can add webhook logic here)
    const paymentConfirmed = await checkPaymentWithGateway(orderId, order.total_amount);

    return NextResponse.json({
      orderId,
      status: paymentConfirmed ? 'paid' : order.status,
      totalAmount: order.total_amount,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}

// Helper function to check with payment gateway
async function checkPaymentWithGateway(orderId: string, amount: number): Promise<boolean> {
  // TODO: Implement actual payment gateway check
  // This is where you would call VNPay, Momo, or other payment APIs
  
  // For now, return false (no payment confirmed)
  // You can replace this with actual payment gateway integration
  return false;
} 