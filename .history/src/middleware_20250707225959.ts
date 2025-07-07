import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

// Routes that require authentication
const protectedRoutes = [
  "/profile",
  "/orders",
  "/checkout",
  "/settings",
  "/admin",
];

// Routes that are only for non-authenticated users
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// API routes that don't require authentication
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/products",
  "/api/categories",
  "/api/brands",
  "/api/search",
  "/api/pc-builder",
];

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const token = request.cookies.get("accessToken")?.value;
  if (token) {
    return token;
  }

  return null;
}

async function isAuthenticated(token: string): Promise<boolean> {
  try {
    const payload = await verifyToken(token);
    return !!payload;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = getToken(request);
  const isAuth = token ? await isAuthenticated(token) : false;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuth) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      } else {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (pathname.startsWith("/admin")) {
      if (isAuth) {
        const payload = await verifyToken(token!);
        const isAdmin = payload?.roles?.includes("ADMIN");
        if (!isAdmin) {
          if (pathname.startsWith("/api/")) {
            return NextResponse.json(
              { error: "Forbidden" },
              { status: 403 }
            );
          } else {
            return NextResponse.redirect(new URL("/", request.url));
          }
        }
      }
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
