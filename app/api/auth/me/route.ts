import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import jwt from "jsonwebtoken";

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId: string };

    // Get user from Sanity
    const query = `*[_type == "user" && _id == $userId][0]`;
    const user = await client.fetch(query, { userId: decoded.userId });

    if (!user) {
      const cookieStore = await cookies();
      cookieStore.delete("auth_token");
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // Return user data (excluding password)
    const userData = { ...user };
    delete userData.password;

    return NextResponse.json({
      user: userData,
    });
  } catch (error) {
    console.error("Auth check error:", error);

    // Clear invalid token
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
