import { NextRequest, NextResponse } from "next/server";
import { dbHelpers } from "@/lib/database";
import { jwtService } from "@/lib/jwt";
import { passwordUtils } from "@/lib/password";
import { LoginForm, LoginResponse, ResponseMessage } from "@/types/auth";
import {
  ErrorMessages,
  handleDatabaseError,
  createErrorResponse,
} from "@/lib/errorMessages";

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
      return NextResponse.json(
        createErrorResponse(400, ErrorMessages.AUTH.EMAIL_REQUIRED),
        { status: 400 }
      );
    }

    if (!password || password.trim().length === 0) {
      return NextResponse.json(
        createErrorResponse(400, ErrorMessages.AUTH.PASSWORD_REQUIRED),
        { status: 400 }
      );
    }

    // Find user by username (email)
    const user = await dbHelpers.findUserByUsername(username);

    if (!user) {
      if (process.env.NODE_ENV === "development") {
        console.log("DEBUG: User not found for username:", username);
      }
      return NextResponse.json(
        createErrorResponse(404, ErrorMessages.AUTH.EMAIL_NOT_EXISTS),
        { status: 404 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log("DEBUG: User found:", user.email);
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        createErrorResponse(403, ErrorMessages.AUTH.ACCOUNT_DISABLED),
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await passwordUtils.verifyPassword(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      if (process.env.NODE_ENV === "development") {
        console.log("DEBUG: Invalid password for user:", username);
      }
      return NextResponse.json(
        createErrorResponse(401, ErrorMessages.AUTH.INVALID_CREDENTIALS),
        { status: 401 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.log("DEBUG: Authentication successful for user:", username);
      console.log("DEBUG: User role from database:", user.role);
    }

    // Generate tokens
    const roles = [user.role || "USER"];
    if (process.env.NODE_ENV === "development") {
      console.log("DEBUG: Roles for token generation:", roles);
    }
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

    if (process.env.NODE_ENV === "development") {
      console.log("DEBUG: Login successful, returning tokens");
    }

    // Return success response
    return NextResponse.json(loginResponse, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Login error:", error);
    } else {
      console.error("Login error:", (error as any).message);
    }

    // Use handleDatabaseError helper for consistent error handling
    const { status, message } = handleDatabaseError(error);
    return NextResponse.json(createErrorResponse(status, message), { status });
  }
}
