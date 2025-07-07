import { NextRequest, NextResponse } from "next/server";
import { jwtService, tokenUtils } from "@/lib/jwt";
import { LoginResponse, ResponseMessage } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = tokenUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "JWT Token is missing",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    if (await jwtService.isTokenExpired(token)) {
      const errorResponse: ResponseMessage = {
        status: 401,
        message: "Refresh token đã hết hạn",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const username = await jwtService.extractUsername(token);
    const roles = await jwtService.getRolesFromToken(token);

    const tokenPair = await jwtService.generateTokenPair(username, roles);

    const refreshResponse: LoginResponse = {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      tokenType: tokenPair.tokenType,
      expiresIn: tokenPair.expiresIn,
    };

    return NextResponse.json(refreshResponse, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
        console.error("Token refresh error:", error);
    } else {
      console.error("Token refresh error:", (error as any).message);
    }

    const errorResponse: ResponseMessage = {
      status: 401,
      message: "Refresh token không hợp lệ",
    };

    return NextResponse.json(errorResponse, { status: 401 });
  }
}
