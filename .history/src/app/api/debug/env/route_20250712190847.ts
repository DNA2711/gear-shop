import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE,
    VNPAY_SECRET_KEY: process.env.VNPAY_SECRET_KEY?.substring(0, 10) + "...", // Only show first 10 chars for security
    timestamp: new Date().toISOString(),
  });
} 