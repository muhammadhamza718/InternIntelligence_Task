"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to process request");
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] overflow-hidden">
        <video
          src="/video/video.mp4"
          className="w-full h-full object-cover scale-[1.3]"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex text-black items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <h2 className="text-indigo-600 font-bold text-xl">TYLET</h2>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-gray-500 mt-2 text-sm">
                {isSubmitted
                  ? "Check your email for reset instructions."
                  : "Enter your email and we'll send you instructions to reset your password."}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@example.com"
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-white bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>

                <div className="text-sm mt-4 text-center">
                  <Link href="/" className="text-indigo-600 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md text-green-800 text-sm">
                  We've sent password reset instructions to{" "}
                  <strong>{email}</strong>. Please check your email.
                </div>

                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full"
                >
                  Try Another Email
                </Button>

                <div className="text-sm mt-4">
                  <Link href="/" className="text-indigo-600 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
