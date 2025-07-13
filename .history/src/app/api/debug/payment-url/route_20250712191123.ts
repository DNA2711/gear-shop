import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, orderInfo } = await request.json();

    // Get base URL logic (same as in create-payment-url)
    let baseUrl;
    
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else {
      const host = request.headers.get("host");
      const protocol =
        request.headers.get("x-forwarded-proto") ||
        (host?.includes("localhost") ? "http" : "https");

      if (host) {
        baseUrl = `${protocol}://${host}`;
      } else {
        baseUrl = process.env.NODE_ENV !== "production"
          ? "http://localhost:3000"
          : "https://gearhub-vn.vercel.app";
      }
    }

    baseUrl = baseUrl.replace(/\/$/, "");

    const mockPaymentUrl = `${baseUrl}/vnpay/checkout?orderId=${orderId}&amount=${amount}&orderInfo=${encodeURIComponent(
      orderInfo
    )}`;

    return NextResponse.json({
      success: true,
      debug: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        VERCEL_URL: process.env.VERCEL_URL,
        host: request.headers.get("host"),
        protocol: request.headers.get("x-forwarded-proto"),
        calculatedBaseUrl: baseUrl,
        generatedPaymentUrl: mockPaymentUrl,
        isDemoMode: process.env.VNPAY_TMN_CODE === "DEMO",
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Debug failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
} 