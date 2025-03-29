import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { randomBytes } from "crypto";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userQuery = `*[_type == "user" && email == $email][0]`;
    const user = await client.fetch(userQuery, { email });

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({
        message:
          "If your email is registered, you will receive reset instructions shortly",
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store reset token in Sanity
    await client
      .patch(user._id)
      .set({
        resetToken,
        resetTokenExpiry: resetTokenExpiry.toISOString(),
      })
      .commit();

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: "Tylet <onboarding@resend.dev>",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({
      message:
        "If your email is registered, you will receive reset instructions shortly",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
