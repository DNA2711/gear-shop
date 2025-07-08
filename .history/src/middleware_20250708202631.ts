import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "@/lib/jwt";
import { TOKEN_KEYS } from "@/lib/tokenManager";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/admin",
  "/api/auth/me",
  "/api/admin",
];

const authRoutes = ["/login", "/register"];

const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/brands",
  "/api/products",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authHeader = request.headers.get("Authorization");
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  // Try to get token from cookies using standardized key
  if (!token) {
    token = request.cookies.get(TOKEN_KEYS.ACCESS_TOKEN)?.value || null;
  }

  let isAuthenticated = false;
  let userRole = "";
  let tokenExpired = false;

  if (token) {
    try {
      const payload = await jwtService.verifyToken(token);
      isAuthenticated = true;
      userRole = payload.roles?.[0] || "USER";
    } catch (error) {
      isAuthenticated = false;
      // Check if token is expired (for potential refresh)
      tokenExpired = error instanceof Error && error.message.includes('expired');
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      if (!pathname.startsWith("/api/")) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        if (tokenExpired) {
          loginUrl.searchParams.set("expired", "true");
        }
        return NextResponse.redirect(loginUrl);
      }

      return NextResponse.json(
        {
          status: 401,
          message: tokenExpired ? "Token đã hết hạn" : "Token không hợp lệ hoặc đã hết hạn",
          expired: tokenExpired,
        },
        { status: 401 }
      );
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (userRole.toLowerCase() !== "admin") {
        if (!pathname.startsWith("/api/")) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.json(
          {
            status: 403,
            message: "Không có quyền truy cập",
          },
          { status: 403 }
        );
      }
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
