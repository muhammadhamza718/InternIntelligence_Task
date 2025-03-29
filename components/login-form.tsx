"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      // Show success message and redirect after a short delay
      toast.success("Logged in successfully", {
        onAutoClose: () => {
          router.push("/dashboard");
          router.refresh(); // Refresh the page to update the auth state
        },
      });
    } catch {
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen text-black bg-[#FFFFFF]">
      {/* Left side with illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] overflow-hidden">
        <video
          src="/video/video.mp4"
          className="w-full h-full object-cover sm:scale-[1.1] md:scale-[1.2] lg:scale-[1.3]"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-start pl-40 p-8">
        <div className="w-full h-full flex flex-col pt-32 max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-40">
            <h2 className="text-[#6366F1] font-bold text-xl flex items-center">
              TYLET
            </h2>
          </div>

          {/* Form */}
          <div className="flex items-center">
            <div className="space-y-12">
              <div>
                <h1 className="text-3xl font-bold text-black mb-6">Log In</h1>
                <p className="text-gray-600 font-semibold mt-2 text-sm">
                  Enter your email and password to login your dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-lg font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@example.com"
                    className="w-full rounded-lg border-gray-200 bg-white px-4 py-6 text-base focus:border-[#6366F1] focus:ring-[#6366F1]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-lg font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      className="w-full border-gray-200 bg-white px-4 py-6 text-base focus:border-[#6366F1] focus:ring-[#6366F1]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#5d5fe7] hover:bg-[#494bd1] text-white py-3 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="flex flex-col space-y-2 text-sm">
                  <p className="text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-[#6366F1] hover:underline font-medium"
                    >
                      Sign Up
                    </Link>
                  </p>
                  <Link
                    href="/forgot-password"
                    className="text-[#6366F1] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
