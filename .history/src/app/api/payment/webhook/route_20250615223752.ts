import { NextResponse } from "next/server";
import { db } from "@/lib/database";

// Webhook để nhận thông báo từ cổng thanh toán (VNPay, Momo, etc.)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Log webhook data for debugging
    console.log("Payment webhook received:", body);

    // Extract payment information (format depends on your payment gateway)
    const {
      orderId,
      amount,
      status,
      transactionId,
      signature,
      // Add other fields based on your payment gateway
    } = body;

    // Verify webhook signature (important for security)
    const isValidSignature = await verifyWebhookSignature(body, signature);
    if (!isValidSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Get order from database
    const order = await db.queryFirst(
      "SELECT id, status, total_amount FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) {
      console.error(`Order ${orderId} not found`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify amount matches
    if (parseFloat(amount) !== parseFloat(order.total_amount)) {
      console.error(`Amount mismatch for order ${orderId}: ${amount} vs ${order.total_amount}`);
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Update order status based on payment status
    let newOrderStatus = order.status;
    if (status === 'success' || status === 'completed') {
      newOrderStatus = 'paid';
    } else if (status === 'failed' || status === 'cancelled') {
      newOrderStatus = 'cancelled';
    }

    // Update order in database
    if (newOrderStatus !== order.status) {
      await db.update(
        "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
        [newOrderStatus, orderId]
      );
      
      // Log successful update
      console.log(`Order ${orderId} status updated to ${newOrderStatus}`);
      
      // TODO: Send email notification to customer
      // TODO: Update inventory if payment successful
      // TODO: Trigger other business logic
    }

    // Return success response to payment gateway
    return NextResponse.json({ 
      success: true, 
      message: "Webhook processed successfully",
      orderId,
      status: newOrderStatus 
    });

  } catch (error) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Verify webhook signature for security
async function verifyWebhookSignature(body: any, signature: string): Promise<boolean> {
  // TODO: Implement signature verification based on your payment gateway
  // Each payment gateway has different signature verification methods
  
  // For VNPay, you would:
  // 1. Sort parameters
  // 2. Create hash string
  // 3. Generate HMAC-SHA256 signature
  // 4. Compare with received signature
  
  // For now, return true (skip verification in development)
  // IMPORTANT: Implement proper verification in production!
  return true;
} 