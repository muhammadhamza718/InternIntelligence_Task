import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/auth"

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile", "/settings"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  if (isProtectedRoute) {
    // Get token from cookies
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Verify token
      await verifyToken(token)

      // Token is valid, continue
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Not a protected route, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth/login|api/auth/register).*)",
  ],
}

