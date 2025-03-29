import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken, sanityClient } from "@/lib/auth";

// Rate limiting setup - simplified for now
const ipRequests = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - simplified
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const MAX_REQUESTS = 5;
    const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

    if (ipRequests.has(ip)) {
      const requestData = ipRequests.get(ip)!;

      if (now > requestData.resetTime) {
        ipRequests.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else if (requestData.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { message: "Too many login attempts. Please try again later." },
          { status: 429 }
        );
      } else {
        ipRequests.set(ip, {
          count: requestData.count + 1,
          resetTime: requestData.resetTime,
        });
      }
    } else {
      ipRequests.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Parse request body
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Query Sanity for user with matching email
    const query = `*[_type == "user" && email == $email][0]`;
    const user = await sanityClient.fetch(query, { email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken({
      userId: user._id,
      email: user.email,
      name: user.name || "",
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "strict",
    });

    // Return user data (excluding password)
    const { password: userPassword, ...userData } = user;
    delete userData.password;

    return NextResponse.json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
