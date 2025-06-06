import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Tất cả các trường là bắt buộc" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Mật khẩu xác nhận không khớp" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // TODO: Kiểm tra email đã tồn tại trong database
    // TODO: Hash password trước khi lưu
    // Ví dụ tạm thời:
    if (email === "admin@gearshop.com") {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // TODO: Lưu user vào database
    const newUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công",
      user: newUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Lỗi server nội bộ" }, { status: 500 });
  }
}
