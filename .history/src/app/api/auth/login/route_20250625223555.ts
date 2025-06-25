import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { jwtService } from "@/lib/jwt";
import { passwordUtils } from "@/lib/password";
import { LoginForm, LoginResponse, ResponseMessage } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginForm = await request.json();
    const { username, password } = body;

    if (process.env.NODE_ENV === "development") {
      console.log("DEBUG: Login attempt for username:", username);
    }

    // Validate input
    if (!username || username.trim().length === 0) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Vui lòng nhập email",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (!password || password.trim().length === 0) {
      const errorResponse: ResponseMessage = {
        status: 400,
        message: "Vui lòng nhập mật khẩu",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find user by username (email)
    const user = await dbHelpers.findUserByUsername(username);

    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.log("DEBUG: User not found for username:", username);
      }
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "Email hoặc mật khẩu không đúng",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("DEBUG: User found:", user.email);
    }

    // Check if user is active
    if (!user.is_active) {
      const errorResponse: ResponseMessage = {
        status: 403,
        message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên",
      };
      return NextResponse.json(errorResponse, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await passwordUtils.verifyPassword(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      if (process.env.NODE_ENV === 'development') {
        console.log("DEBUG: Invalid password for user:", username);
      }
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "Email hoặc mật khẩu không đúng",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    console.log("DEBUG: Authentication successful for user:", username);
    console.log("DEBUG: User role from database:", user.role);

    // Generate tokens
    const roles = [user.role || "USER"];
    console.log("DEBUG: Roles for token generation:", roles);
    const tokenPair = await jwtService.generateTokenPair(username, roles);

    // Prepare login response (matching Spring Boot LoginResponse)
    const loginResponse: LoginResponse = {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      tokenType: tokenPair.tokenType,
      expiresIn: tokenPair.expiresIn,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    };

    console.log("DEBUG: Login successful, returning tokens");

    // Return success response
    return NextResponse.json(loginResponse, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    const errorResponse: ResponseMessage = {
      status: 500,
      message: "Lỗi server nội bộ",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
