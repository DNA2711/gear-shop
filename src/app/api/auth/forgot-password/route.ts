import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra email có tồn tại không
    const users = await db.query(
      "SELECT user_id, email, full_name FROM users WHERE email = ? AND is_active = 1",
      [email]
    );

    if (users.length === 0) {
      // Không tiết lộ email có tồn tại hay không vì lý do bảo mật
      return NextResponse.json({
        success: true,
        message: "Nếu email tồn tại, chúng tôi đã gửi link reset mật khẩu",
      });
    }

    const user = users[0];

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    // Lưu token vào database
    await db.update(
      "UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE user_id = ?",
      [resetToken, resetExpires, user.user_id]
    );

    // Tạo reset URL
    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    // Gửi email reset password
    try {
      const emailSent = await sendPasswordResetEmail(
        email,
        user.full_name,
        resetUrl
      );

      if (!emailSent) {
        console.warn("Failed to send reset email, but continuing...");
        // Không fail request nếu email không gửi được
      } else {
        console.log("✅ Password reset email sent successfully to:", email);
      }
    } catch (emailError) {
      console.error("Error sending reset email:", emailError);
      // Không fail request nếu email có lỗi
    }

    // Log để debug (chỉ trong development)
    if (process.env.NODE_ENV === "development") {
      console.log("=== PASSWORD RESET EMAIL (DEV) ===");
      console.log(`To: ${email}`);
      console.log(`Name: ${user.full_name}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log(`Token expires in 15 minutes`);
      console.log("===================================");
    }

    return NextResponse.json({
      success: true,
      message: "Nếu email tồn tại, chúng tôi đã gửi link reset mật khẩu",
      // Trong môi trường dev, trả về token để test
      ...(process.env.NODE_ENV === "development" && {
        resetToken,
        resetUrl,
        message: "Link reset mật khẩu đã được tạo (check console để lấy link)",
      }),
    });
  } catch (error) {
    console.error("Lỗi forgot password:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    );
  }
}
