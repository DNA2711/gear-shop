import { NextRequest, NextResponse } from "next/server";
import { jwtService } from "@/lib/jwt";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/admin",
  "/api/auth/me",
  "/api/admin",
];

// Routes that are only for non-authenticated users
const authRoutes = ["/login", "/register"];

// API routes that don't require authentication
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/brands",
  "/api/products",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get("Authorization");
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : request.cookies.get("auth-token")?.value;

  // Fallback: Try to get token from next request (for client-side routing)
  if (!token) {
    // Check if there's a token in cookies set by the client
    const accessTokenCookie = request.cookies.get("accessToken")?.value;
    if (accessTokenCookie) {
      token = accessTokenCookie;
    }
  }

  // Check if user is authenticated
  let isAuthenticated = false;
  let userRole = "";

  if (token) {
    try {
      const payload = await jwtService.verifyToken(token);
      isAuthenticated = true;
      userRole = payload.roles?.[0] || "USER";
    } catch (error) {
      // Token is invalid or expired
      isAuthenticated = false;
    }
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login for web pages
      if (!pathname.startsWith("/api/")) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Return 401 for API routes
      return NextResponse.json(
        {
          status: 401,
          message: "Token không hợp lệ hoặc đã hết hạn",
        },
        { status: 401 }
      );
    }

    // Check admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (userRole.toLowerCase() !== "admin") {
        // Redirect to homepage for web pages (not dashboard to avoid loops)
        if (!pathname.startsWith("/api/")) {
          return NextResponse.redirect(new URL("/", request.url));
        }

        // Return 403 for API routes
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

  // Handle auth routes (login, register)
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Handle public API routes
  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    // Allow access to public API routes
    return NextResponse.next();
  }

  // Add CORS headers for API routes
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    // Add CORS headers
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
