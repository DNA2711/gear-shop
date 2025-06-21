import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { tokenUtils } from "@/lib/jwt";
import { ResponseMessage, ChangePasswordRequest } from "@/types/auth";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const { username } = await tokenUtils.extractUserFromRequest(request);

    // Parse request body
    const body: ChangePasswordRequest = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    console.log("DEBUG: Change password request for user:", username);

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Vui lòng điền đầy đủ thông tin",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (newPassword.length < 6) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find user in database
    const user = await dbHelpers.findUserByUsername(username);

    if (!user) {
      console.log("DEBUG: User not found in database:", username);
      const errorResponse: ResponseMessage = {
        status: 404,
        message: "Người dùng không tồn tại",
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isCurrentPasswordValid) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Mật khẩu hiện tại không chính xác",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSamePassword) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Mật khẩu mới phải khác với mật khẩu hiện tại",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const affectedRows = await dbHelpers.updateUserPassword(
      user.user_id,
      hashedNewPassword
    );

    if (affectedRows === 0) {
      const errorResponse: ResponseMessage = {
        status: 500,
        message: "Không thể cập nhật mật khẩu. Vui lòng thử lại.",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log("DEBUG: Password changed successfully for user:", username);

    // Return success response
    const successResponse: ResponseMessage = {
      status: 200,
      message: "Đổi mật khẩu thành công",
    };

    return NextResponse.json(successResponse, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Change password error:", error);

    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes("token")) {
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "Token không hợp lệ hoặc đã hết hạn",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const errorResponse: ResponseMessage = {
      status: 500,
      message: "Lỗi server nội bộ",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
