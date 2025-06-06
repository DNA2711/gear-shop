import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth-token");

    if (!authToken) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // TODO: Verify token và lấy thông tin user từ database
    // Tạm thời return mock data
    const user = {
      id: "1",
      email: "admin@gearshop.com",
      name: "Admin User",
      role: "admin",
    };

    return NextResponse.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Get user info error:", error);
    return NextResponse.json({ error: "Lỗi server nội bộ" }, { status: 500 });
  }
}
