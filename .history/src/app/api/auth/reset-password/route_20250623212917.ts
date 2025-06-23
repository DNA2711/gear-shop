import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { hashPassword } from "@/lib/password";
import { RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token và mật khẩu mới là bắt buộc" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Kiểm tra token có hợp lệ và chưa hết hạn không
    const users = await db.query(
      `SELECT user_id, email, full_name 
       FROM users 
       WHERE reset_password_token = ? 
       AND reset_password_expires > NOW() 
       AND is_active = 1`,
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    const user = users[0];

    // Hash mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu và xóa reset token
    await db.update(
      `UPDATE users 
       SET password_hash = ?, 
           reset_password_token = NULL, 
           reset_password_expires = NULL,
           updated_at = NOW()
       WHERE user_id = ?`,
      [hashedPassword, user.user_id]
    );

    console.log(`Password reset successful for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Mật khẩu đã được cập nhật thành công",
    });
  } catch (error) {
    console.error("Lỗi reset password:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}

// API để kiểm tra token có hợp lệ không
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra token
    const users = await db.query(
      `SELECT user_id, email 
       FROM users 
       WHERE reset_password_token = ? 
       AND reset_password_expires > NOW() 
       AND is_active = 1`,
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token hợp lệ",
      email: users[0].email,
    });
  } catch (error) {
    console.error("Lỗi kiểm tra token:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}
