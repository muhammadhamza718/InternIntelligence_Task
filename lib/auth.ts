import { createClient } from "next-sanity";
import { jwtVerify, SignJWT } from "jose";

// Initialize Sanity client
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Secret key for JWT
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
};

// Login function
export async function login(email: string, password: string) {
  try {
    // Call the login API endpoint
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Login failed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Logout function
export async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      return { success: false, error: "Logout failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// Types
export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

// Create JWT token (server-side only)
export async function createToken(payload: TokenPayload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(getJwtSecretKey());

    return token;
  } catch (error) {
    console.error("Token creation error:", error);
    throw new Error("Failed to create token");
  }
}

// Verify JWT token (server-side only)
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
}
