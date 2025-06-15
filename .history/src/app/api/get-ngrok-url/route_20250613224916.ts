import { NextResponse } from "next/server";

export async function GET() {
  try {
    // For now, return a mock payment URL since ngrok is having issues
    // In production, you would integrate with a real payment gateway
    const mockPaymentUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/checkout/payment-processing`;

    return NextResponse.json({
      url: mockPaymentUrl,
      message: "Mock payment URL generated successfully",
    });
  } catch (error) {
    console.error("Error in get-ngrok-url:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
