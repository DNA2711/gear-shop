import { NextRequest, NextResponse } from "next/server";
import { jwtService, tokenUtils } from "@/lib/jwt";
import { LoginResponse, ResponseMessage } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("Authorization");
    const token = tokenUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "JWT Token is missing",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    console.log("DEBUG: Refresh token request received");

    // Check if refresh token is expired
    if (await jwtService.isTokenExpired(token)) {
      console.log("DEBUG: Refresh token is expired");
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "Refresh token đã hết hạn",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Extract user info from token
    const username = await jwtService.extractUsername(token);
    const roles = await jwtService.getRolesFromToken(token);

    console.log("DEBUG: Refreshing tokens for user:", username);

    // Generate new token pair
    const tokenPair = await jwtService.generateTokenPair(username, roles);

    // Prepare response (matching Spring Boot LoginResponse)
    const refreshResponse: LoginResponse = {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      tokenType: tokenPair.tokenType,
      expiresIn: tokenPair.expiresIn,
    };

    console.log("DEBUG: Token refresh successful");

    return NextResponse.json(refreshResponse, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);

    const errorResponse: ResponseMessage = {
      status: 401,
      message: "Refresh token không hợp lệ",
    };

    return NextResponse.json(errorResponse, { status: 401 });
  }
}
